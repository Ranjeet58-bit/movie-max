import React, { useEffect, useState } from "react";
import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    return (
       <>
           <ContentWrapper>
            <div className="favoritesPage">
                <h1>Your Favorite Movies</h1>
                {favorites.length > 0 ? (
                    <div className="movieGrid">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.id} data={movie} mediaType={movie.mediaType} />
                        ))}
                    </div>
                ) : (
                    <p>No favorite movies found.</p>
                )}
            </div>
        </ContentWrapper>
       </>
    );
};

export default Favorites;
