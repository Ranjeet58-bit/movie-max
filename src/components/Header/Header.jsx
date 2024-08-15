import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation, Link } from "react-router-dom";

import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movie-logo.png";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
          setShow("hide");
        } else {
          setShow("show");
        }
      } else {
        setShow("top");
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY, mobileMenu]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.length > 0) {
        navigate(`/search/${query}`);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimeout);
  }, [query, navigate]);

  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setQuery("");
    }
  }, [location]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const navigationHandler = (type) => {
    setQuery(""); // Clear the search query on navigation
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
  };

  return (
    <header
      className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}
      role="banner"
    >
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")} aria-label="Go to home">
          <img src={logo} alt="Movie Logo" />
        </div>
        <nav className="headerLeft" aria-label="Primary">
          <ul className="menuItems">
            <li
              className="menuItem"
              onClick={() => navigationHandler("movie")}
              aria-label="Navigate to Movies"
            >
              Movies
            </li>
            <li
              className="menuItem"
              onClick={() => navigationHandler("tv")}
              aria-label="Navigate to TV Shows"
            >
              TV Shows
            </li>
            <li className="menuItem">
              <Link to="/favorites" aria-label="Go to Favorites Page">
                Favorites
              </Link>
            </li>
          </ul>
          <div className="searchInput">
            {/* <label htmlFor="search" className="sr-only">
              Search for a movie or TV show
            </label> */}
            <input
              id="search"
              type="text"
              placeholder="Search for a movie or TV..."
              value={query}
              onChange={handleInputChange}
              onKeyUp={(e) =>
                e.key === "Enter" &&
                query.length > 0 &&
                navigate(`/search/${query}`)
              }
              aria-label="Search for a movie or TV show"
            />
            <button onClick={openSearch} aria-label="Open search">
              <HiOutlineSearch />
            </button>
          </div>
          <div className="mobileMenuItems">
            {mobileMenu ? (
              <button onClick={() => setMobileMenu(false)} aria-label="Close mobile menu">
                <VscChromeClose />
              </button>
            ) : (
              <button onClick={openMobileMenu} aria-label="Open mobile menu">
                <SlMenu />
              </button>
            )}
          </div>
        </nav>
      </ContentWrapper>
    </header>
  );
};

export default Header;
