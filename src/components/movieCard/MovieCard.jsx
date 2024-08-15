import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import "./style.scss";
import PosterFallback from "../../assets/no-poster.png";
import Geners from "../geners/Geners";
import CircleRating from "../circleRating/CircleRating";
import Img from "../LazyLoadingImgae/Img";

const MovieCard = ({ data, fromSearch, mediaType }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();
    const posterUrl = data.poster_path ? url.poster + data.poster_path : PosterFallback;

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Check if the movie is already in favorites
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.some(movie => movie.id === data.id));
    }, [data.id]);

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Prevent navigating when clicking on the heart icon
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        if (isFavorite) {
            // Remove from favorites
            favorites = favorites.filter(movie => movie.id !== data.id);
        } else {
            // Add to favorites
            favorites.push({ ...data, mediaType: data.media_type || mediaType });
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    return (
        <div
            className="movieCard"
            onClick={() => navigate(`/${data.media_type || mediaType}/${data.id}`)}
        >
            <div className="posterBlock">
                <Img className="posterImg" src={posterUrl} />
                {!fromSearch && (
                    <>
                        <CircleRating rating={data.vote_average.toFixed(1)} />
                        <Geners data={data.genre_ids.slice(0, 2)} />
                        <div className="favoriteIcon" onClick={handleFavoriteClick}>
                            {isFavorite ? <FaHeart color="white" /> : <FaRegHeart />}
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
};

export default MovieCard;
