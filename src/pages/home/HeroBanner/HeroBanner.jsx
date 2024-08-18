/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import useFetch from "../../../hooks/useFetch";
import Img from "../../../components/LazyLoadingImgae/Img";
import { useSelector } from "react-redux";
import { GrPrevious, GrNext } from "react-icons/gr";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

// Utility functions for genres and languages
const renderGenres = (genreIds) => {
  const genreNames = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return genreIds.map((id) => genreNames[id] || "Unknown").join(", ");
};

const renderLanguage = (languageCode) => {
  const languageNames = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    ja: "Japanese",
    zh: "Chinese",
    ru: "Russian",
    it: "Italian",
    pt: "Portuguese",
    ko: "Korean",
    ar: "Arabic",
    // Add more language codes and names as needed
  };

  return languageNames[languageCode] || languageCode;
};

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, isLoading } = useFetch("/movie/upcoming");

  const slides = data?.results?.map((movie) => ({
    title: movie.title || movie.name,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    backdrop: url.backdrop + movie.backdrop_path,
    id: movie.id,
    language: movie.original_language,
    genres: movie.genre_ids,
    description: movie.overview,
  })) || [];

  useEffect(() => {
    let interval;

    if (autoSlide) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => clearInterval(interval);
  }, [autoSlide, currentIndex]);

  const handlePlayClick = (id) => {
    navigate(`/movie/${id}`);
    setAutoSlide(false); // Stop auto sliding when play button is clicked
  };

  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentIndex(slides.length - 1);
    } else if (index >= slides.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Adjust for transition duration
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  return (
    <div className="heroBanner">
      <div className="carouselWrapper">
        <div
          className={`carouselInner ${isTransitioning ? "fadeOutRight" : ""}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <CarouselSlide
              key={slide.id}
              slide={slide}
              handlePlayClick={handlePlayClick}
              renderGenres={renderGenres}
              renderLanguage={renderLanguage}
            />
          ))}
        </div>
        <div className="carouselControls">
          <button className="prevButton" onClick={prevSlide} aria-label="Previous slide">
            <GrPrevious />
          </button>
          <button className="nextButton" onClick={nextSlide} aria-label="Next slide">
            <GrNext />
          </button>
        </div>
      </div>
    </div>
  );
};

// CarouselSlide component with props for utility functions
const CarouselSlide = memo(({ slide, handlePlayClick, renderGenres, renderLanguage }) => (
  <div className="carouselSlide">
    <div className="backdrop__img">
      <Img src={slide.backdrop} alt={slide.title} />
    </div>
    <div className="opacityLayer"></div>
    <ContentWrapper>
      <div className="carouselContent">
        <h2 className="title">{slide.title}</h2>
        <p className="description">{slide.description}</p>
        <h6 className="rating">
          <span>Rating:</span> {slide.rating}
        </h6>
        <div className="heroGneres">
          <p className="language">
            {renderLanguage(slide.language)}
          </p>
          <p className="genres">
            <span>Genres:</span> {renderGenres(slide.genres)}
          </p>
        </div>
      </div>
    </ContentWrapper>
  </div>
));

export default HeroBanner;
