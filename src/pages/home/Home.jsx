import React, { lazy, Suspense, memo } from 'react';
import './style.scss';
import HeroBanner from './HeroBanner/HeroBanner';

// Lazy load components
const Trending = lazy(() => import('./trending/Trending'));
const Popular = lazy(() => import('./popular/Popular'));
const TopRated = lazy(() => import('./topRated/TopRated'));

const Home = () => {
  return (
    <div className='homePage'>
      <HeroBanner />

      <Suspense fallback={<div>Loading trending...</div>}>
        <Trending />
      </Suspense>

      <Suspense fallback={<div>Loading popular...</div>}>
        <Popular />
      </Suspense>

      <Suspense fallback={<div>Loading top-rated...</div>}>
        <TopRated />
      </Suspense>
    </div>
  );
};

export default memo(Home);
