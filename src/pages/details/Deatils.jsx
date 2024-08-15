import React from "react";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import DetailBanner from "./detailsBanner/DetailBanner";
import Cast from "./cast/Cast";
import VideoSection from "./videoSection/VideoSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";




const Deatils = () => {
  const {mediaType, id} =  useParams()
  const {data, loading} = useFetch(`/${mediaType}/${id}/videos`)
  const {data: credits, loading: credistLoading} = useFetch(`/${mediaType}/${id}/credits`)

  return (
    <div>
      <DetailBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={credistLoading} />
       <VideoSection data = {data} loading = {loading}/>
       <Similar  mediaType={mediaType} id={id}/>
       <Recommendation   mediaType={mediaType} id={id} />
    </div>
  );
};

export default Deatils;
