import React, { useState } from "react";
import Select from "react-select";
import "./style.scss";

const CustomModal = ({ show, handleClose, onApplyFilters, genresData }) => {
  if (!show) return null;

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [releaseYearRange, setReleaseYearRange] = useState({ from: "", to: "" });
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" }); 

  const handleApply = () => {
    onApplyFilters({
      genres: selectedGenres,
      releaseYearRange,
      ratingRange,
    });
    handleClose();
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h2>Filters</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          <div className="filter-group">
            <label>Genres</label>
            <Select
              isMulti
              options={genresData?.genres}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              onChange={(selected) => setSelectedGenres(selected)}
              className="custom-select-container"
              classNamePrefix="custom-select"
            />
          </div>
          <div className="filter-group">
            <label>Release Year</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="From"
                value={releaseYearRange.from}
                onChange={(e) =>
                  setReleaseYearRange({ ...releaseYearRange, from: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="To"
                value={releaseYearRange.to}
                onChange={(e) =>
                  setReleaseYearRange({ ...releaseYearRange, to: e.target.value })
                }
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Rating</label>
            <div className="range-inputs">
              <input
                type="number"
                min={1}
                max={10}
                placeholder="Min"
                value={ratingRange.min}
                onChange={(e) =>
                  setRatingRange({ ...ratingRange, min: e.target.value })
                }
              />
              <input
                type="number"
                min={1}
                max={10}
                placeholder="Max"
                value={ratingRange.max}
                onChange={(e) =>
                  setRatingRange({ ...ratingRange, max: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          {/* <button onClick={handleClose} className="cancel-btn">Cancel</button> */}
          <button onClick={handleApply} className="apply-btn">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
