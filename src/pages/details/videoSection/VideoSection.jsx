import React, { useState, useRef } from "react";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { PlayIcon } from "../PlayBtn";
import Img from "../../../components/LazyLoadingImgae/Img";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const VideoSection = ({ data, loading }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const videoListRef = useRef(null);
  const scrollAmount = 300; // Adjust scroll amount to make navigation faster

  const loadingSkeleton = () => (
    <div className="skItem">
      <div className="thumb skeleton"></div>
      <div className="row skeleton"></div>
      <div className="row2 skeleton"></div>
    </div>
  );

  const handleKeyDown = (e) => {
    const list = videoListRef.current;
    if (e.key === "ArrowRight") {
      list.scrollLeft += scrollAmount; // Faster scroll with each key press
    } else if (e.key === "ArrowLeft") {
      list.scrollLeft -= scrollAmount; // Faster scroll with each key press
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) { // Check if the left mouse button is pressed
      const list = videoListRef.current;
      list.scrollLeft -= e.movementX; // Move based on mouse movement
    }
  };

  return (
    <div className="videosSection" aria-labelledby="section-heading">
      <ContentWrapper>
        <div id="section-heading" className="sectionHeading">
          Official Videos
        </div>
        {!loading ? (
          <div
            className="videos"
            ref={videoListRef}
            tabIndex="0"
            onKeyDown={handleKeyDown}
            onMouseMove={handleMouseMove}
          >
            {data?.results?.map((video) => (
              <div
                key={video.id}
                className="videoItem"
                onClick={() => {
                  setVideoId(video.key);
                  setShow(true);
                }}
                role="button"
                tabIndex="0"
                aria-label={`Play video: ${video.name}`}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setVideoId(video.key);
                    setShow(true);
                  }
                }}
              >
                <div className="videoThumbnail">
                  <Img
                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                    alt={`Thumbnail of ${video.name}`}
                  />
                  <PlayIcon />
                </div>
                <div className="videoTitle">{video.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="videoSkeleton">
            {loadingSkeleton()}
            {loadingSkeleton()}
            {loadingSkeleton()}
            {loadingSkeleton()}
          </div>
        )}
      </ContentWrapper>
      <VideoPopup
        show={show}
        setShow={setShow}
        videoId={videoId}
        setVideoId={setVideoId}
      />
    </div>
  );
};

export default VideoSection;
