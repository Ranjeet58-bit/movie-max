/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../LazyLoadingImgae/Img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../geners/Geners";
import './style.scss';

const Carousel = ({ data, loading, endpoint, title }) => {
    const carouselContainer = useRef();
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const handleFavoriteClick = (e, item) => {
        e.stopPropagation();
        let updatedFavorites = [...favorites];

        if (favorites.some(fav => fav.id === item.id)) {
            updatedFavorites = updatedFavorites.filter(fav => fav.id !== item.id);
        } else {
            updatedFavorites.push({ ...item, mediaType: item.media_type || endpoint });
        }

        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const isFavorite = (id) => {
        return favorites.some(fav => fav.id === id);
    };

    const handleKeyDown = (e, dir) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            navigation(dir);
        }
    };

    const navigation = (dir) => {
        const container = carouselContainer.current;
        const scrollAmount = dir === "left"
            ? container.scrollLeft - (container.offsetWidth + 20)
            : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const skItem = () => {
        return (
            <div className="skeletonItem">
                <div className="posterBlock skeleton"></div>
                <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div>
            </div>
        );
    };
    

    return (
        <div className="carousel">
            <ContentWrapper>
                {title && <div className="carouselTitle">{title}</div>}
                <BsFillArrowLeftCircleFill
                    className="carouselLeftNav arrow"
                    onClick={() => navigation("left")}
                    onKeyDown={(e) => handleKeyDown(e, "left")}
                    tabIndex={0}
                    aria-label="Scroll carousel left"
                />
                <BsFillArrowRightCircleFill
                    className="carouselRightNav arrow"
                    onClick={() => navigation("right")}
                    onKeyDown={(e) => handleKeyDown(e, "right")}
                    tabIndex={0}
                    aria-label="Scroll carousel right"
                />
                {!loading ? (
                    <div className="carouselItems" ref={carouselContainer}>
                        {data?.map((item, index) => {
                            const posterUrl = item.poster_path
                                ? url.poster + item.poster_path
                                : PosterFallback;
                            return (
                                <div
                                    key={item.id}
                                    className="carouselItem"
                                    onClick={() => navigate(`/${item.media_type || endpoint}/${item.id}`)}
                                    tabIndex={0}
                                    aria-labelledby={`carousel-item-title-${index}`}
                                >
                                    <div className="posterBlock">
                                        <Img src={posterUrl} alt={`${item.title || item.name} poster`} />
                                        <CircleRating rating={item.vote_average.toFixed(1)} />
                                        <Genres data={item.genre_ids.slice(0, 2)} />
                                        <button
                                            className="favoriteIcon"
                                            onClick={(e) => handleFavoriteClick(e, item)}
                                            aria-pressed={isFavorite(item.id)}
                                            aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                                            tabIndex={-1} 
                                        >
                                            {isFavorite(item.id) ? <FaHeart color="#f89e00" /> : <FaRegHeart />}
                                        </button>
                                    </div>
                                    <div className="textBlock">
                                        <span id={`carousel-item-title-${index}`} className="title">{item.title || item.name}</span>
                                        <span className="date">
                                            {dayjs(item.release_date).format("MMM D, YYYY")}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="loadingSkeleton">
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Carousel;
