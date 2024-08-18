import React, { Suspense, lazy, useMemo } from "react";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import DetailBanner from "./detailsBanner/DetailBanner";
import Cast from "./cast/Cast";
import VideoSection from "./videoSection/VideoSection";
import Spinner from "../../components/spinner/Spinner";


const Similar = lazy(() => import("./carousels/Similar"));
const Recommendation = lazy(() => import("./carousels/Recommendation"));

const Deatils = () => {
  const { mediaType, id } = useParams();

  // Fetch data using custom hook
  const { data: videoData, loading: videoLoading, error: videoError } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: creditsData, loading: creditsLoading, error: creditsError } = useFetch(`/${mediaType}/${id}/credits`);
  const { data: similarData, loading: similarLoading, error: similarError } = useFetch(`/${mediaType}/${id}/similar`);
  const { data: recommendationData, loading: recommendationLoading, error: recommendationError } = useFetch(`/${mediaType}/${id}/recommendations`);

  // Memoize data to avoid unnecessary re-renders
  const video = useMemo(() => videoData?.results?.[0], [videoData]);
  const crew = useMemo(() => creditsData?.crew, [creditsData]);
  const cast = useMemo(() => creditsData?.cast, [creditsData]);
  const similar = useMemo(() => similarData?.results, [similarData]);
  const recommendations = useMemo(() => recommendationData?.results, [recommendationData]);


  if (videoError || creditsError || similarError || recommendationError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div>
      <DetailBanner video={video} crew={crew} />

      {cast && cast.length > 0 && (
        <Cast data={cast} loading={creditsLoading} />
      )}

      {video && (
        <VideoSection data={videoData} loading={videoLoading} />
      )}

      <Suspense fallback={<Spinner />}>
        {similar && similar.length > 0 && (
          <Similar mediaType={mediaType} id={id} data={similar} loading={similarLoading} />
        )}

        {recommendations && recommendations.length > 0 && (
          <Recommendation mediaType={mediaType} id={id} data={recommendations} loading={recommendationLoading} />
        )}
      </Suspense>
    </div>
  );
};


Deatils.displayName = "Deatils";

export default Deatils;
