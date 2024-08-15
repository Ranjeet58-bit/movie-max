import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";

const InfiniteScrollWithObserver = ({
  children,
  dataLength,
  next,
  hasMore,
  loader,
  endMessage,
  className,
  style,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsFetching(true);
          next().finally(() => setIsFetching(false));
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMore, next]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div className={className} style={style}>
      {children}
      {isFetching && hasMore && loader}
      {!hasMore && endMessage}
      <div ref={lastElementRef} style={{ height: "1px" }} />
    </div>
  );
};

InfiniteScrollWithObserver.propTypes = {
  children: PropTypes.node.isRequired,
  dataLength: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loader: PropTypes.node,
  endMessage: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default React.memo(InfiniteScrollWithObserver);
