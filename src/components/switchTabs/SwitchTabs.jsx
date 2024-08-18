import React, { useState } from "react";
import "./style.scss";

const SwitchTabs = ({ data, onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [left, setLeft] = useState(0);

  const handleTabChange = (tab, index) => {
    setLeft(index * 100);
    setTimeout(() => {
      setSelectedTab(index);
    }, 300);
    onTabChange(tab, index);
  };

  const handleKeyDown = (event, tab, index) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleTabChange(tab, index);
        break;
      case "ArrowRight":
        event.preventDefault();
        const nextIndex = (selectedTab + 1) % data.length;
        handleTabChange(data[nextIndex], nextIndex);
        break;
      case "ArrowLeft":
        event.preventDefault();
        const prevIndex = (selectedTab - 1 + data.length) % data.length;
        handleTabChange(data[prevIndex], prevIndex);
        break;
      default:
        break;
    }
  };

  return (
    <div className="switchingTabs" role="tablist">
      <div className="tabItems">
        {data.map((tab, index) => (
          <span
            key={index}
            onClick={() => handleTabChange(tab, index)}
            onKeyDown={(event) => handleKeyDown(event, tab, index)}
            role="tab"
            tabIndex={0}
            aria-selected={selectedTab === index}
            className={`tabItem ${selectedTab === index ? "active" : ""}`}
          >
            {tab}
          </span>
        ))}
        <span className="movingBg" style={{ left }} />
      </div>
    </div>
  );
};

export default SwitchTabs;
