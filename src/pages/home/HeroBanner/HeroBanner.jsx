import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import useFetch from "../../../hooks/useFetch";
import Img from "../../../components/LazyLoadingImgae/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { useSelector } from "react-redux";
import herodefault from  '../../../assets/default-hero.jpg';

const HeroBanner = () => {
  const [background, setBackground] = useState(herodefault);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, isLoading } = useFetch("/movie/upcoming");

  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const bg = url.backdrop + data.results[randomIndex]?.backdrop_path;

      if (bg) {
        setBackground(bg);
      } else {
        setBackground(herodefault); 
      }
    }
  }, [data, url.backdrop]);

  
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.length > 0) {
        navigate(`/search/${query}`);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimeout);
  }, [query, navigate]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="heroBanner">
      {!isLoading && background && (
        <div className="backdrop__img">
          <Img src={background} alt="Background image" />
        </div>
      )}
      <div className="opacityLayer"></div>

      <ContentWrapper>
        <div className="heroBanner__Content">
          <span className="title">Welcome.</span>
          <span className="subTitle">
            Millions of movies, TV shows, and people to discover. Explore now.
          </span>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search for a movie or TV show..."
              value={query}
              onChange={handleInputChange}
            />
            <button
              onClick={() => {
                if (query.length > 0) {
                  navigate(`/search/${query}`);
                }
              }}
            >
              Search
            </button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
