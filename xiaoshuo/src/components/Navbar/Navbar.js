import React, { useEffect, useState } from "react";
import styles from './NavBar.module.css'
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/link";
import { userApi } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/auth";
import { ROLE_NAME } from "../../constants/role";

function Navbar() {
  const isLogin = useSelector(state => state.auth.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roles = useSelector(state => state.auth.userInfo?.roles);
  const isAuthor = roles?.includes(ROLE_NAME.AUTHOR);

  //退出登录
  const logoutHandle = () => {
    dispatch(logout());
    // 跳转到首页
    navigate(ROUTES.HOME);
  };

  //搜索
  const [searchKey, setKeyword] = useState("");
  /**
   * 处理搜索按钮点击事件的函数
   * @param {Object} e - 事件对象
   */
  const handleSearch = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    // 导航到分类页面，并将搜索关键字作为URL参数传递
    navigate(`${ROUTES.CATEGORY}?searchKey=${encodeURIComponent(searchKey)}`);
  };

  const [nick, setNick] = useState()
  useEffect(() => {
    if (!isLogin) {
      setNick(null); // 退出登录时清空昵称
      return;
    }
    userApi.user().then(res => {
      setNick(res.data.result.nick);
    }).catch(() => {
      // 退出登录
      dispatch(logout());
    });
  }, [isLogin]);

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
                to={ROUTES.HOME}
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
                to={ROUTES.CATEGORY}
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
                to={ROUTES.RANGKING_LIST}
                className={({ isActive }) =>
                  isActive ? `nav-link active` : `nav-link`
                }
                end
              >
                排行榜
              </NavLink>
            </li>
            <li className={`nav-item`}>
              {
                isLogin ?
                  <NavLink
                    to={ROUTES.PERSON}
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
            <li className={`nav-item`}>
              {
                isLogin ?
                  <NavLink
                    to={ROUTES.PUBLISH}
                    className={({ isActive }) =>
                      isActive ? `nav-link active` : `nav-link`
                    }
                    end
                  >
                    {isAuthor ? '发表作品' : '作者认证'}
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
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className={`btn btn-outline-light`} type="submit" onClick={handleSearch}>搜索</button>
          </form>
          <ul className={`navbar-nav ms-2`}>
            {
              isLogin ?
                <>
                  <li className={`nav-item`}>
                    <NavLink
                      to={ROUTES.PERSON}
                      className={({ isActive }) =>
                        isActive ? `nav-link active` : `nav-link`
                      }
                      end
                    >
                      {nick}
                    </NavLink>
                  </li>
                  <li className={`nav-item`}>
                    <NavLink
                      to={ROUTES.HOME}
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
                      to={ROUTES.SIGNIN}
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
                      to={ROUTES.SIGNUP}
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