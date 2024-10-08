import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/geners/Geners";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/LazyLoadingImgae/Img";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../PlayBtn";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailBanner = React.memo(({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);
  const { url = {} } = useSelector((state) => state.home);
  const _genres = useMemo(
    () => data?.genres?.map((g) => g.id) || [],
    [data?.genres]
  );
  const director = useMemo(
    () => crew?.filter((f) => f.job === "Director") || [],
    [crew]
  );
  const writer = useMemo(
    () =>
      crew?.filter(
        (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
      ) || [],
    [crew]
  );

  const toHoursAndMinutes = useCallback((totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  }, []);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {data ? (
            <>
              <div className="backdrop-img">
                <Img
                  src={
                    url.backdrop
                      ? url.backdrop + data.backdrop_path
                      : PosterFallback
                  }
                  alt="Backdrop"
                  loading="lazy"
                />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={
                          url.backdrop
                            ? url.backdrop + data.poster_path
                            : PosterFallback
                        }
                        alt={data.title || "Poster"}
                        loading="lazy"
                      />
                    ) : (
                      <Img
                        className="posterImg"
                        src={PosterFallback}
                        alt="Poster"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={_genres} />
                    <div className="row">
                      <CircleRating
                        rating={data.vote_average?.toFixed(1) || "N/A"}
                      />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          setVideoId(video.key);
                        }}
                      >
                        <PlayIcon />
                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>
                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data.overview}</div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItems">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItems">
                          <span className="text bold">Release: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItems">
                          <span className="text bold">Duration: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>
                    {director.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {writer.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {data.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data.created_by.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data.created_by.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </>
          ) : (
            <div>No data available</div>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
});

DetailBanner.displayName = "DetailBanner";

export default DetailBanner;
