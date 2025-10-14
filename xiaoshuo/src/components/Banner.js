import React, { useState, useEffect } from 'react';

function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    "热门连载《剑来》每日爆更",
    "新书上线《深空彼岸》震撼来袭", 
    "限时活动：阅读打卡赢好礼"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);
  
  return (
    <div className="banner-container">
      <div className="banner-slide">
        <div>{banners[currentBanner]}</div>
      </div>
      <div className="banner-indicators">
        {banners.map((_, index) => (
          <div 
            key={index}
            className={`banner-indicator ${index === currentBanner ? 'active' : ''}`}
            onClick={() => setCurrentBanner(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Banner;
