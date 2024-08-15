import React, { useEffect, useState, useCallback } from "react";
import "./style.scss";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import noResult from "../../assets/no-results.png";
import { useParams } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import MovieCard from "../../components/movieCard/MovieCard";
import CustomInfiniteScroll from "../../components/CustomInfiniteScroll/CustomInfiniteScroll";

const SearchResult = () => {
  const [data, setData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const { query } = useParams();

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDataFromApi(`/search/multi?query=${query}&page=1`);
      setData(res.results || []);
      setPageNum(2); // Start from the second page for infinite scroll
      setHasMore(res.total_pages > 1); // Determine if more pages are available
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const fetchNextPageData = useCallback(async () => {
    if (!loading && hasMore) {
      try {
        const res = await fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`);
        setData((prevData) => [...prevData, ...(res.results || [])]);
        setPageNum((prevPageNum) => prevPageNum + 1);
        setHasMore(pageNum < res.total_pages); // Check if there are more pages to load
      } catch (err) {
        setError("Failed to load more results. Please try again.");
      }
    }
  }, [loading, pageNum, hasMore, query]);

  useEffect(() => {
    fetchInitialData();
  }, [query, fetchInitialData]);

  return (
    <div className="searchResultsPage">
      <ContentWrapper>
        {loading && pageNum === 2 && <Spinner initial={true} />}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && data.length > 0 ? (
          <>
            <div className="pageTitle">
              {`Search ${
                data.length > 1 ? "results" : "result"
              } for '${query}'`}
            </div>
            <CustomInfiniteScroll
              className="content"
              dataLength={data.length}
              next={fetchNextPageData}
              hasMore={hasMore}
              loader={<Spinner />}
            >
              {data.map((item, index) => {
                if (item.media_type === "person") return null;
                return <MovieCard key={index} data={item} fromSearch={true} />;
              })}
            </CustomInfiniteScroll>
          </>
        ) : (
          !loading && (
            <div className="no-results">
              <img src={noResult} alt="No Results" />
              <h6>Sorry, results not found!</h6>
            </div>
          )
        )}
      </ContentWrapper>
    </div>
  );
};

export default SearchResult;
