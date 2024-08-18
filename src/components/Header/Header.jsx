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
        <div
          className="logo"
          onClick={() => navigate("/")}
          aria-label="Go to home"
          role="button"
          tabIndex={0} // Make the logo focusable
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <img src={logo} alt="Movie Logo" />
        </div>
        <nav className="headerLeft" aria-label="Primary navigation">
          <ul className="menuItems">
            <li
              className="menuItem"
              onClick={() => navigationHandler("movie")}
              aria-label="Navigate to Movies"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigationHandler("movie")}
            >
              Movies
            </li>
            <li
              className="menuItem"
              onClick={() => navigationHandler("tv")}
              aria-label="Navigate to TV Shows"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigationHandler("tv")}
            >
              TV Shows
            </li>
            <li className="menuItem">
              <Link
                to="/favorites"
                aria-label="Go to Favorites Page"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/favorites")}
              >
                Favorites
              </Link>
            </li>
          </ul>
          <div className="searchInput">
            <input
              id="search"
              type="text"
              placeholder="Search here...."
              value={query}
              onChange={handleInputChange}
              onKeyUp={(e) =>
                e.key === "Enter" &&
                query.length > 0 &&
                navigate(`/search/${query}`)
              }
              aria-label="Search for movies or TV shows"
              aria-describedby="search-helper-text"
            />
            <button onClick={openSearch} aria-label="Open search">
              <HiOutlineSearch />
            </button>
          </div>
          <div className="mobileMenuItems">
            {mobileMenu ? (
              <button
                onClick={() => setMobileMenu(false)}
                aria-label="Close mobile menu"
              >
                <VscChromeClose />
              </button>
            ) : (
              <button
                onClick={openMobileMenu}
                aria-label="Open mobile menu"
              >
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
