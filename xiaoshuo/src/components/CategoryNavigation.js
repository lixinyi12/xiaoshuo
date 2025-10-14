import React from 'react';

function CategoryNavigation() {
  const categories = [
    "玄幻", "都市", "仙侠", "历史", "科幻", 
    "悬疑", "言情", "武侠", "军事", "竞技", 
    "轻小说", "更多"
  ];
  
  return (
    <section className="mb-5">
      <h3 className="section-title">小说分类</h3>
      <div className="row text-center">
        {categories.map((category, index) => (
          <div key={index} className="col-6 col-md-3 col-lg-2 mb-3">
            <a href="#" className="btn btn-outline-primary w-100">{category}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryNavigation;
