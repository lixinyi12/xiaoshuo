import React from 'react';
import NovelCard from './NovelCard';

function HotRecommendation({ novels }) {
  return (
    <section className="mb-5">
      <h3 className="section-title">🔥 热门推荐</h3>
      <div className="row">
        {novels.map((novel, index) => (
          <NovelCard key={index} novel={novel} type="hot" />
        ))}
      </div>
    </section>
  );
}

export default HotRecommendation;
