import React from 'react';
import styles from './SignUp.module.css';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';

const SignUp = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">用户注册</h3>
                            
                            {/* 垂直表单布局 - Bootstrap默认样式 */}
                            <form role="form">
                                {/* 手机号输入组 */}
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label-lg">
                                        手机号
                                    </label>
                                    <input 
                                        type="text" 
                                        className={`form-control form-control-lg ${styles.formControl}`} 
                                        id="username"
                                        placeholder="请输入手机号"
                                    />
                                    <small className="form-text text-muted">
                                        请输入您的手机号
                                    </small>
                                </div>

                                {/* 邮箱输入组 */}
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label-lg">
                                        邮箱
                                    </label>
                                    <input 
                                        type="text" 
                                        className={`form-control form-control-lg ${styles.formControl}`} 
                                        id="username"
                                        placeholder="请输入邮箱地址"
                                    />
                                    <small className="form-text text-muted">
                                        请输入您的电子邮箱
                                    </small>
                                </div>

                                {/* 密码输入组 */}
                                <div className="form-group mt-3">
                                    <label htmlFor="password" className="col-form-label-lg">
                                        密码
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`form-control form-control-lg ${styles.formControl}`} 
                                        id="password"
                                        placeholder="请输入密码"
                                    />
                                </div>

                                {/* 密码重新输入组 */}
                                <div className="form-group mt-3">
                                    <label htmlFor="password" className="col-form-label-lg">
                                        重新输入密码
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`form-control form-control-lg ${styles.formControl}`} 
                                        id="password"
                                        placeholder="请重新输入密码"
                                    />
                                </div>

                                {/* 提交按钮 */}
                                <div className="d-grid gap-2 mt-4">
                                    <button type="submit" className={`btn btn-primary btn-lg ${styles.btn}`}>
                                        注册
                                    </button>
                                </div>

                                {/* 注册链接 */}
                                <div className="text-center mt-3">
                                    <span>已经注册过账号？</span>
                                    <NavLink 
                                        to='/SignIn' 
                                        end
                                    >
                                        点击登录
                                    </NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;