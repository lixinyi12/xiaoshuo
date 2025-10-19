import React from 'react';
import styles from './NavBar.module.css'
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../actions/auth'

function Navbar() {
  const token = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  //退出登录
  const logoutHandle = ()=>{
    console.log(authActions);
    
    dispatch(authActions.logOut({}))
  }

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
                Object.keys(token).length>0?
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
            <input className={`form-control me-4`} type="search" placeholder="搜索小说或作者..." />
            <button className={`btn btn-outline-light`} type="submit">搜索</button>
          </form>
          <ul className={`navbar-nav ms-2`}>
            {
              Object.keys(token).length>0?
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