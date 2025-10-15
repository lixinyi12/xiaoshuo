import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';

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
            <li className="nav-item">
              <NavLink 
                to='/' 
                className={({ isActive }) => 
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                首页
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to='/Category' 
                className={({ isActive }) => 
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                分类
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to='/RangkingList' 
                className={({ isActive }) => 
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                排行榜
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to='/BookShelf' 
                className={({ isActive }) => 
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                书架
              </NavLink>
            </li>
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
