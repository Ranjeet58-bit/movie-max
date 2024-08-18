import React, { useState, memo } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import useFetch from '../../../hooks/useFetch';
import Carousel from '../../../components/carousel/Carousel';

const TopRated = () => {
    const [endpoint, setEndPoint] = useState("movie");
    const { data, loading } = useFetch(`/${endpoint}/top_rated`);

    const onTabChange = (tab) => {
        setEndPoint(tab === "Movies" ? "movie" : "tv");
    };

    return (
        <div className='carouselSection'>
            <ContentWrapper>
                <span className='carouselTitle' role="heading" aria-level="2">Top Rated</span>
                <SwitchTabs 
                    data={["Movies", "Tv Shows"]} 
                    onTabChange={onTabChange} 
                    ariaLabel="Top Rated tabs: Movies and TV Shows"
                />
            </ContentWrapper>
            <Carousel 
                data={data?.results} 
                loading={loading} 
                endpoint={endpoint} 
                ariaLabel="Top Rated content carousel"
            />
        </div>
    );
};

export default memo(TopRated);
