import React, { useState, memo, lazy, Suspense } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import useFetch from '../../../hooks/useFetch';

// Lazy load components
const SwitchTabs = lazy(() => import('../../../components/switchTabs/SwitchTabs'));
const Carousel = lazy(() => import('../../../components/carousel/Carousel'));

const Popular = () => {
  const [endpoint, setEndPoint] = useState("movie");
  const { data, loading } = useFetch(`/${endpoint}/popular`);

  const onTabChange = (tab) => {
    setEndPoint(tab === "Movies" ? "movie" : "tv");
  };

  return (
    <div className='carouselSection'>
      <ContentWrapper>
        <span className='carouselTitle' role="heading" aria-level="2">What's Popular</span>
        <Suspense fallback={<div>Loading tabs...</div>}>
          <SwitchTabs 
            data={["Movies", "Tv Shows"]} 
            onTabChange={onTabChange} 
          />
        </Suspense>
      </ContentWrapper>
      <Suspense fallback={<div>Loading carousel...</div>}>
        <Carousel 
          data={data?.results} 
          loading={loading} 
          endpoint={endpoint} 
        />
      </Suspense>
    </div>
  );
};

export default memo(Popular);
