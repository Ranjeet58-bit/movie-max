import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import CustomInfiniteScroll from "../../components/CustomInfiniteScroll/CustomInfiniteScroll";
import { IoFilter } from "react-icons/io5";


const CustomModalLazy = React.lazy(() => import("../../components/CustomModal/CustomModal")); 

let filters = {};

const Explore = () => {
    const { mediaType } = useParams();
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [showModal, setShowModal] = useState(false);

    const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

    // Fetch initial data
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchDataFromApi(`/discover/${mediaType}`, filters);
            setData(res);
            setPageNum((prev) => prev + 1);
        } catch (err) {
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [mediaType]);

    // Fetch next page data
    const fetchNextPageData = useCallback(async () => {
        try {
            const res = await fetchDataFromApi(`/discover/${mediaType}?page=${pageNum}`, filters);
            if (data?.results) {
                setData((prevData) => ({
                    ...prevData,
                    results: [...prevData.results, ...res.results],
                }));
            } else {
                setData(res);
            }
            setPageNum((prev) => prev + 1);
        } catch (err) {
            setError("Failed to load more data. Please try again later.");
        }
    }, [pageNum, data, mediaType]);

    // Handle filter application
    const handleApplyFilters = useCallback((appliedFilters) => {
        const newFilters = { ...filters };
        const displayFilters = { ...selectedFilters };

        if (appliedFilters.genres && appliedFilters.genres.length > 0) {
            const selectedGenreIds = appliedFilters.genres.map((g) => g.id);
            const selectedGenreNames = appliedFilters.genres.map((g) => g.name);

            newFilters.with_genres = selectedGenreIds.join(',');
            displayFilters.genres = selectedGenreNames;
        }

        if (appliedFilters.releaseYearRange.from) {
            newFilters.primary_release_date_gte = `${appliedFilters.releaseYearRange.from}-01-01`;
            displayFilters.releaseYearRange = `${appliedFilters.releaseYearRange.from}`;
        }

        if (appliedFilters.releaseYearRange.to) {
            newFilters.primary_release_date_lte = `${appliedFilters.releaseYearRange.to}-12-31`;
            displayFilters.releaseYearRange += ` to ${appliedFilters.releaseYearRange.to}`;
        }

        if (appliedFilters.ratingRange.min) {
            newFilters.vote_average_gte = appliedFilters.ratingRange.min;
            displayFilters.ratingRange = `${appliedFilters.ratingRange.min}`;
        }

        if (appliedFilters.ratingRange.max) {
            newFilters.vote_average_lte = appliedFilters.ratingRange.max;
            displayFilters.ratingRange += ` to ${appliedFilters.ratingRange.max}`;
        }

        filters = newFilters;
        setSelectedFilters(displayFilters);
        fetchInitialData();
    }, [fetchInitialData, selectedFilters]);

    // Reset filters and fetch data on mediaType change
    useEffect(() => {
        filters = {};
        setData(null);
        setPageNum(1);
        setSelectedFilters({});
        fetchInitialData();
    }, [mediaType, fetchInitialData]);

    // Handle filter removal
    const handleRemoveFilter = useCallback((filterKey, filterValue) => {
        if (filterKey === "genres") {
            const genreIds = filters.with_genres.split(',').map(Number);
            const selectedGenreIds = genresData?.genres
                .filter(g => filterValue.includes(g.name))
                .map(g => g.id);

            const updatedGenreIds = genreIds.filter(id => !selectedGenreIds.includes(id));
            filters.with_genres = updatedGenreIds.length > 0
                ? updatedGenreIds.join(',')
                : undefined;
        } else {
            delete filters[filterKey];
        }

        setSelectedFilters((prev) => {
            const updatedFilters = { ...prev };
            if (filterKey === "genres") {
                updatedFilters.genres = updatedFilters.genres.filter(name => !filterValue.includes(name));
            } else {
                delete updatedFilters[filterKey];
            }
            return updatedFilters;
        });

        fetchInitialData();
    }, [genresData, fetchInitialData]);

    // Memoized selected filters
    const memoizedSelectedFilters = useMemo(() => {
        return Object.keys(selectedFilters).map((key) => {
            if (key === "genres") {
                return selectedFilters[key].map((genreName, index) => (
                    <div className="filterItem" key={index}>
                        <span>Genre: {genreName}</span>
                        <span className="removeFilter" onClick={() => handleRemoveFilter(key, [genreName])}>×</span>
                    </div>
                ));
            }
            return (
                <div className="filterItem" key={key}>
                    <span>
                        {key === "releaseYearRange" && `Releasing Year: ${selectedFilters[key]}`}
                        {key === "ratingRange" && `Rating: ${selectedFilters[key]}`}
                    </span>
                    <span className="removeFilter" onClick={() => handleRemoveFilter(key, selectedFilters[key])}>×</span>
                </div>
            );
        });
    }, [selectedFilters, handleRemoveFilter]);

    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">
                        {mediaType === "tv" ? "Explore TV Shows" : "Explore Movies"}
                    </div>
                    <button onClick={() => setShowModal(true)} className="filter-btn">
                        <IoFilter />
                    </button>
                </div>
                <div className="selectedFilters">
                    {memoizedSelectedFilters}
                </div>
                {loading && <Spinner initial={true} />}
                {error && <div className="error">{error}</div>}
                {!loading && !error && (
                    <>
                        {data?.results?.length > 0 ? (
                            <CustomInfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results?.map((item, index) => {
                                    if (item.media_type === "person") return null;
                                    return (
                                        <MovieCard key={index} data={item} mediaType={mediaType} />
                                    );
                                })}
                            </CustomInfiniteScroll>
                        ) : (
                            <span className="resultNotFound">Sorry, Results not found!</span>
                        )}
                    </>
                )}
            </ContentWrapper>

            {/* Custom Modal for Filters */}
            <Suspense fallback={<Spinner />}>
                <CustomModalLazy
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    onApplyFilters={handleApplyFilters}
                    genresData={genresData}
                />
            </Suspense>
        </div>
    );
};

export default Explore;
