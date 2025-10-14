import React from 'react';

function RankingList({ title, rankId, data }) {
  return (
    <>
      <h5 className="section-title">{title}</h5>
      <ol className="rank-list" id={rankId}>
        {data.map((item, index) => (
          <li key={index}>
            <span className={`rank-number ${index < 3 ? 'top-three' : ''}`}>
              {index + 1}
            </span>
            <div>
              <div className="fw-bold">{item.title}</div>
              <small className="text-muted">{item.author}</small>
              <div className="text-primary small">
                {item.clicks || item.collects || item.recommends}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

export default RankingList;
