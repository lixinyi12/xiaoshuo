import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <a className="navbar-brand" href="#">📚 小说阅读网</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><a className="nav-link active" href="#">首页</a></li>
            <li className="nav-item"><a className="nav-link" href="#">分类</a></li>
            <li className="nav-item"><a className="nav-link" href="#">排行榜</a></li>
            <li className="nav-item"><a className="nav-link" href="#">书架</a></li>
            <li className="nav-item"><a className="nav-link" href="#">完本</a></li>
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="搜索小说或作者..." />
            <button className="btn btn-outline-light" type="submit">搜索</button>
          </form>
          <ul className="navbar-nav ms-2">
            <li className="nav-item"><a className="nav-link" href="#">登录</a></li>
            <li className="nav-item"><a className="nav-link" href="#">注册</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
