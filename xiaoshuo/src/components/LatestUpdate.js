import React from 'react';
import NovelCard from './NovelCard';

function LatestUpdate({ novels }) {
  return (
    <section className="mb-5">
      <h3 className="section-title">🆕 最新更新</h3>
      <div className="row">
        {novels.map((novel, index) => (
          <NovelCard key={index} novel={novel} type="latest" />
        ))}
      </div>
    </section>
  );
}

export default LatestUpdate;
