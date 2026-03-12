import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css'

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.notFoundContainer}>
      <div className="not-found-content">
        <div className="error-graphic">
          <div className="error-number">4 0 4</div>
          <div className="error-robot">🤖</div>
        </div>

        <h1 className="error-title">页面不存在</h1>

        <p className="error-message">
          抱歉，您访问的页面可能已被移动、删除或暂时不可用。
        </p>

        <div className="error-suggestions">
          <p>您可以尝试以下操作：</p>
          <ul>
            <li>检查访问地址是否正确</li>
            <li>返回上一页面继续浏览</li>
            <li>联系技术支持寻求帮助</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button
            className="btn-secondary"
            onClick={handleGoBack}
          >
            ← 返回上页
          </button>
          <button
            className="btn-primary"
            onClick={handleGoHome}
          >
            返回首页
          </button>
        </div>

        <div className="search-box">
          <p>或者搜索您需要的内容：</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="请输入关键词..."
              className="search-input"
            />
            <button className="search-btn">搜索</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;