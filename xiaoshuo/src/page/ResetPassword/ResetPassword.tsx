import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/link';
import { authApi } from '../../api';
import { addFlashMessage } from '../../actions/flash';
import { useDispatch } from 'react-redux';

const ResetPassword = () => {
    const dispatch = useDispatch();
    // 初始化状态
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: ''
    });

    // 处理输入变化（使用计算属性名简化代码）
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, // 保留其他字段的值
            [name]: value // 动态更新当前改变的字段
        });
    };

    // 处理表单提交
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        dispatch(addFlashMessage({ type: '', msg: '' })); // 清空旧消息

        // 密码一致性校验
        if (formData.password !== formData.password2) {
            dispatch(addFlashMessage({
                type: 'danger',
                msg: '两次输入的密码不一致',
                id: Math.random().toString().slice(2)
            }));
            return;
        }

        try {
            const response = await authApi.reset({
                username: formData.username,
                password: formData.password
            });
            const data = response.data;
            if (data.status === 200) {
                // 成功
                dispatch(addFlashMessage({ type: 'success', msg: data.msg || '密码重置成功' }));
                // 跳转到登录页
                window.location.href = ROUTES.SIGNIN;
            } else {
                dispatch(addFlashMessage({ type: 'danger', msg: data.msg || '重置失败，请稍后重试' }));
            }
        } catch (error) {
            console.error('网络错误:', error);
            dispatch(addFlashMessage({ type: 'danger', msg: '网络异常，请检查连接' }));
        }
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
                                        to={ROUTES.PERSON}
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