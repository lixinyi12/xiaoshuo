import React from 'react';

function NovelCard({ novel, type = 'hot' }) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="card novel-card h-100">
        <div className="novel-cover">
          {novel.title}
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{novel.title}</h5>
            <span className="category-badge">{novel.category}</span>
          </div>
          <p className="card-text"><small className="text-muted">作者：{novel.author}</small></p>
          <p className="card-text">{novel.desc}</p>
        </div>
        <div className="card-footer bg-transparent">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {type === 'hot' ? `排名 #${novel.rank}` : novel.update}
            </small>
            <button className="btn btn-sm btn-outline-primary">开始阅读</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovelCard;
