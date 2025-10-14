import React from 'react';

function Footer() {
  return (
    <footer className="text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>关于我们</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">网站简介</a></li>
              <li><a href="#" className="text-light">联系我们</a></li>
              <li><a href="#" className="text-light">加入我们</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>帮助中心</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">用户指南</a></li>
              <li><a href="#" className="text-light">常见问题</a></li>
              <li><a href="#" className="text-light">反馈建议</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>友情链接</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">起点中文网</a></li>
              <li><a href="#" className="text-light">纵横中文网</a></li>
              <li><a href="#" className="text-light">晋江文学城</a></li>
            </ul>
          </div>
        </div>
        <hr />
        <p>&copy; 2025 精品小说阅读网. 版权所有.</p>
      </div>
    </footer>
  );
}

export default Footer;
