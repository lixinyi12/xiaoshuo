import React, { useState } from "react";
import styles from './NavBar.module.css'
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../actions/auth'
import { TOKEN } from '../constants';
import { useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem(TOKEN);
  const dispatch = useDispatch()

  //退出登录
  const logoutHandle = ()=>{
    //清空redux
    dispatch(authActions.logOut(null))
    //清空本地
    localStorage.removeItem(TOKEN)
  }

  //搜索
  const navigate = useNavigate();
  const [searchKey, setKeyword] = useState("");
  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/Category?searchKey=${encodeURIComponent(searchKey)}`);
  };

  return (
    <nav className={`navbar ${styles.navBar} navbar-expand-lg navbar-dark sticky-top`}>
      <div className={`container`}>
        <a className={`navbar-brand ${styles.navBarBrand}`} href="#">📚 小说阅读网</a>
        <button className={`navbar-toggler`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className={`navbar-toggler-icon`}></span>
        </button>
        <div className={`collapse navbar-collapse`} id="navbarNav">
          <ul className={`navbar-nav me-auto`}>
            <li className={`nav-item`}>
              <NavLink 
                to='/' 
                className={({ isActive }) => 
                  isActive ? `nav-link active` : `nav-link`
                }
                end
              >
                首页
              </NavLink>
            </li>
            <li className={`nav-item`}>
              <NavLink 
                to='/Category' 
                className={({ isActive }) => 
                  isActive ? `nav-link active` : `nav-link`
                }
                end
              >
                分类
              </NavLink>
            </li>
            <li className={`nav-item`}>
              <NavLink 
                to='/RangkingList' 
                className={({ isActive }) => 
                  isActive ? `nav-link active` : `nav-link`
                }
                end
              >
                排行榜
              </NavLink>
            </li>
            <li className={`nav-item`}>
              <NavLink 
                to='/BookShelf' 
                className={({ isActive }) => 
                  isActive ? `nav-link active` : `nav-link`
                }
                end
              >
                书架
              </NavLink>
            </li>
            <li className={`nav-item`}>
              {
                token?
                <NavLink 
                  to='/Person' 
                  className={({ isActive }) => 
                    isActive ? `nav-link active` : `nav-link`
                  }
                  end
                >
                  个人中心
                </NavLink>
                :
                <></>
              }
            </li>
          </ul>
          <form className={`d-flex`}>
            <input 
              className={`form-control me-4`} 
              type="search" 
              placeholder="搜索小说或作者..." 
              value={searchKey}
              onChange={(e)=>setKeyword(e.target.value)}
            />
            <button className={`btn btn-outline-light`} type="submit" onClick={handleSearch}>搜索</button>
          </form>
          <ul className={`navbar-nav ms-2`}>
            {
              token?
              <>
                <li className={`nav-item`}>
                  <NavLink 
                    to='/Person' 
                    className={({ isActive }) => 
                      isActive ? `nav-link active` : `nav-link`
                    }
                    end
                  >
                    头像/昵称
                  </NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink 
                    className={({ isActive }) => 
                      isActive ? `nav-link active` : `nav-link`
                    }
                    end
                    onClick={logoutHandle}
                  >
                    退出登录
                  </NavLink>
                </li>
              </>
              :
              <>
                <li className={`nav-item`}>
                  <NavLink 
                    to='/SignIn' 
                    className={({ isActive }) => 
                      isActive ? `nav-link active` : `nav-link`
                    }
                    end
                  >
                    登录
                  </NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink 
                    to='/SignUp' 
                    className={({ isActive }) => 
                      isActive ? `nav-link active` : `nav-link`
                    }
                    end
                  >
                    注册
                  </NavLink>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;