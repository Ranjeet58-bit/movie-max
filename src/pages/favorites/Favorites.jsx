import React, { useEffect, useState, useCallback } from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import { FaTrash, FaPen } from "react-icons/fa";
import './style.scss';

const Favorites = React.memo(function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const handleEditClick = useCallback(() => {
        setEditMode(prevEditMode => !prevEditMode);
        setSelectedItems([]);
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedItems.length === favorites.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(favorites.map(movie => movie.id));
        }
    }, [favorites, selectedItems]);

    const handleItemSelect = useCallback((id) => {
        setSelectedItems(prevSelectedItems => 
            prevSelectedItems.includes(id) 
                ? prevSelectedItems.filter(itemId => itemId !== id) 
                : [...prevSelectedItems, id]
        );
    }, []);

    const handleDelete = useCallback(() => {
        const updatedFavorites = favorites.filter(movie => !selectedItems.includes(movie.id));
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setSelectedItems([]);
        setEditMode(false);
    }, [favorites, selectedItems]);

    return (
        <ContentWrapper>
            <div className="favoritesPage">
                <div className="favoritesHeader">
                    <h1>My List</h1>
                    <div className="myList_Left">
                        {editMode && (
                            <div className="editOptions">
                                <button onClick={handleEditClick} className="discard_btn">
                                    Discard
                                </button>
                                <button onClick={handleSelectAll}>
                                    {selectedItems.length === favorites.length ? "Deselect All" : "Select All"}
                                </button>
                                <button 
                                    className="deletList_btn" 
                                    onClick={handleDelete} 
                                    disabled={selectedItems.length === 0}
                                    aria-disabled={selectedItems.length === 0}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        )}
                        <button className="editFavouriteList" onClick={handleEditClick} aria-label={editMode ? "Finish editing" : "Edit"}>
                            {editMode ? (
                                " "
                            ) : (
                                <div className="editListbtn">
                                    <span><FaPen /></span> Edit
                                </div>
                            )}
                        </button>
                    </div>
                </div>
                {favorites.length > 0 ? (
                    <div className="movieGrid">
                        {favorites.map(movie => (
                            <div key={movie.id} className="movieCardWrapper">
                                {editMode && (
                                    <div className="round">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedItems.includes(movie.id)} 
                                            onChange={() => handleItemSelect(movie.id)}
                                            className="selectCheckbox"
                                            id={`checkbox-${movie.id}`}
                                        />
                                        <label tabIndex={1} htmlFor={`checkbox-${movie.id}`} className="checkboxLabel"></label>
                                    </div>
                                )}
                                <MovieCard 
                                    data={movie} 
                                    mediaType={movie.mediaType} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No favorite movies found.</p>
                )}
            </div>
        </ContentWrapper>
    );
});

// Set the display name for better debugging
Favorites.displayName = 'Favorites';

export default Favorites;
