import React, { useState } from 'react';
import styles from './SignIn.module.css';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';

const ResetPassword = () => {
    // 初始化状态
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: ''
    });

    // 处理输入变化（使用计算属性名简化代码）
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData, // 保留其他字段的值
        [name]: value // 动态更新当前改变的字段
        });
    };

    // 处理表单提交
    const handleSubmit = (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        console.log('登录信息：', formData);
    };
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">重置密码</h3>
                            
                            {/* 垂直表单布局 - Bootstrap默认样式 */}
                            <form role="form" onSubmit={handleSubmit}>
                                {/* 手机号/邮箱输入组 */}
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label-lg">
                                        手机号/邮箱
                                    </label>
                                    <input 
                                        type="text" 
                                        className={`form-control form-control-lg ${styles.formControl}`} 
                                        id="username"
                                        placeholder="请输入手机号或邮箱地址"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    <small className="form-text text-muted">
                                        请输入您注册时使用的手机号或电子邮箱
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
                                        placeholder="请设置新密码"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
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
                                        id="password2"
                                        placeholder="请重新输入密码"
                                        name="password2"
                                        value={formData.password2}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 提交按钮 */}
                                <div className="d-grid gap-2 mt-4">
                                    <button type="submit" className={`btn btn-primary btn-lg ${styles.btn}`}>
                                        重置密码
                                    </button>
                                </div>

                                {/* 注册链接 */}
                                <div className="text-center mt-3">
                                    <NavLink 
                                        to='/SignIn' 
                                        end
                                    >
                                        返回登录
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

export default ResetPassword;