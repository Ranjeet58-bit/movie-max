import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./style.scss";
import PosterFallback from "../../assets/no-poster.png";
import Geners from "../geners/Geners";
import CircleRating from "../circleRating/CircleRating";
import Img from "../LazyLoadingImgae/Img";

const MovieCard = React.memo(({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const posterUrl = data.poster_path
    ? `${url.poster}${data.poster_path}`
    : PosterFallback;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some((movie) => movie.id === data.id));
  }, [data.id]);

  const handleFavoriteClick = useCallback(
    (e) => {
      e.stopPropagation();
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (isFavorite) {
        favorites = favorites.filter((movie) => movie.id !== data.id);
      } else {
        favorites.push({ ...data, mediaType: data.mediaType || mediaType });
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite((prev) => !prev);
    },
    [isFavorite, data, mediaType]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFavoriteClick(e);
    }
  };

  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${data.media_type || mediaType}/${data.id}`)}
      role="button"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${data.title || data.name}`}
    >
      <div className="posterBlock">
        <Img
          className="posterImg"
          src={posterUrl}
          alt={data.title || data.name}
          loading="lazy"
        />
        {!fromSearch && (
          <>
            <CircleRating
              rating={data.vote_average ? data.vote_average.toFixed(1) : "N/A"}
            />
            <Geners data={data.genre_ids ? data.genre_ids.slice(0, 2) : []} />
            <div
              className="favoriteIcon"
              onClick={handleFavoriteClick}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex="-1"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? <FaHeart color="#f89e00" /> : <FaRegHeart />}
            </div>
          </>
        )}
      </div>
      <div className="textBlock">
        <span className="title">{data.title || data.name}</span>
        <span className="date">
          {dayjs(data.release_date).format("MMM D, YYYY")}
        </span>
      </div>
    </div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
