import React, { useRef } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import avatar from "../../../assets/avatar.png";
import Img from "../../../components/LazyLoadingImgae/Img";

const Cast = ({ data, loading }) => {
  const { url } = useSelector((state) => state.home);
  const listRef = useRef(null);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      listRef.current.scrollBy({ left: 200, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      listRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Handle mouse drag to scroll
  const handleMouseDrag = (e) => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    listRef.current.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - listRef.current.offsetLeft;
      scrollLeft = listRef.current.scrollLeft;
    });

    listRef.current.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    listRef.current.addEventListener("mouseup", () => {
      isDragging = false;
    });

    listRef.current.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - listRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      listRef.current.scrollLeft = scrollLeft - walk;
    });
  };

  const skeleton = () => {
    return (
      <div className="skItem">
        <div className="circle skeleton"></div>
        <div className="row skeleton"></div>
        <div className="row2 skeleton"></div>
      </div>
    );
  };

  return (
    <div className="castSection">
      <ContentWrapper>
        <div className="sectionHeading">Top Cast</div>
        {!loading ? (
          <div
            className="listItems"
            ref={listRef}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDrag}
            tabIndex="0"
            role="list"
            aria-label="Top cast list"
          >
            {data?.map((item) => {
              let imgUrl = item.profile_path
                ? url.profile + item.profile_path
                : avatar;
              return (
                <div
                  key={item.id}
                  className="listItem"
                  tabIndex="0"
                  role="listitem"
                  aria-label={`Character ${item.character}, played by ${item.name}`}
                >
                  <div className="profileImg">
                    <Img src={imgUrl} alt={item.name} />
                  </div>
                  <div className="name">{item.name}</div>
                  <div className="character">{item.character}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="castSkeleton">
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Cast;
