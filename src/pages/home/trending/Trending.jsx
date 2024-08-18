import React, { useState, memo } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import useFetch from '../../../hooks/useFetch';
import Carousel from '../../../components/carousel/Carousel';

const Trending = () => {
    const [endpoint, setEndPoint] = useState("day");
    const { data, loading } = useFetch(`/trending/all/${endpoint}`);

    const onTabChange = (tab) => {
        setEndPoint(tab === "Day" ? "day" : "week");
    };

    return (
        <div className='carouselSection'>
            <ContentWrapper>
                <span className='carouselTitle' role="heading" aria-level="2">Trending</span>
                <SwitchTabs 
                    data={["Day", "Week"]} 
                    onTabChange={onTabChange} 
                    ariaLabel="Trending tabs: Day and Week"
                />
            </ContentWrapper>
            <Carousel 
                data={data?.results} 
                loading={loading} 
                ariaLabel="Trending content carousel"
            />
        </div>
    );
};

export default memo(Trending);
