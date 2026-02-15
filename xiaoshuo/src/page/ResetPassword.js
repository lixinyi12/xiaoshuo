import React, { useState } from 'react';
import styles from './SignIn.module.css';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: ''
    });
    
    // 添加状态管理
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // 清除当前字段的错误信息
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // 表单验证函数
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = '请输入手机号或邮箱';
        }
        
        if (!formData.password) {
            newErrors.password = '请输入新密码';
        }
        
        if (!formData.password2) {
            newErrors.password2 = '请再次输入密码';
        } else if (formData.password !== formData.password2) {
            newErrors.password2 = '两次输入的密码不一致';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. 验证表单
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setIsSubmitting(true);
        setErrors({});
        
        try {
            // 2. 模拟API调用（实际项目中替换为真实的API调用）
            console.log('提交重置密码请求：', formData);
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 3. 这里应该是实际的API调用
            // const response = await axios.post('/api/reset-password', formData);
            
            // 模拟成功响应
            const mockResponse = {
                success: true,
                message: '密码重置成功'
            };
            
            if (mockResponse.success) {
                // 4. 重置成功
                setResetSuccess(true);
                
                // 5. 清空表单
                setFormData({
                    username: '',
                    password: '',
                    password2: ''
                });
                
                // 6. 可选：3秒后跳转到登录页
                setTimeout(() => {
                    // 使用 navigate 跳转（需要从 react-router-dom 导入 useNavigate）
                    // navigate('/SignIn');
                }, 3000);
            }
            
        } catch (error) {
            // 处理错误
            setErrors({
                submit: error.response?.data?.message || '重置密码失败，请重试'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">重置密码</h3>
                            
                            {/* 显示成功消息 */}
                            {resetSuccess && (
                                <div className="alert alert-success" role="alert">
                                    密码重置成功！3秒后将跳转到登录页面。
                                </div>
                            )}
                            
                            {/* 显示提交错误 */}
                            {errors.submit && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.submit}
                                </div>
                            )}
                            
                            <form role="form" onSubmit={handleSubmit}>
                                {/* 手机号/邮箱输入组 */}
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label-lg">
                                        手机号/邮箱
                                    </label>
                                    <input 
                                        type="text" 
                                        className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`} 
                                        id="username"
                                        placeholder="请输入手机号或邮箱地址"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        disabled={resetSuccess}
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username}
                                        </div>
                                    )}
                                    <small className="form-text text-muted">
                                        请输入您注册时使用的手机号或电子邮箱
                                    </small>
                                </div>

                                {/* 密码输入组 */}
                                <div className="form-group mt-3">
                                    <label htmlFor="password" className="col-form-label-lg">
                                        新密码
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`} 
                                        id="password"
                                        placeholder="请设置新密码"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={resetSuccess}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* 确认密码输入组 */}
                                <div className="form-group mt-3">
                                    <label htmlFor="password2" className="col-form-label-lg">
                                        确认新密码
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`form-control form-control-lg ${errors.password2 ? 'is-invalid' : ''}`} 
                                        id="password2"
                                        placeholder="请再次输入新密码"
                                        name="password2"
                                        value={formData.password2}
                                        onChange={handleInputChange}
                                        disabled={resetSuccess}
                                    />
                                    {errors.password2 && (
                                        <div className="invalid-feedback">
                                            {errors.password2}
                                        </div>
                                    )}
                                </div>

                                {/* 提交按钮 */}
                                <div className="d-grid gap-2 mt-4">
                                    <button 
                                        type="submit" 
                                        className={`btn btn-primary btn-lg ${styles.btn}`}
                                        disabled={isSubmitting || resetSuccess}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                处理中...
                                            </>
                                        ) : '重置密码'}
                                    </button>
                                </div>

                                {/* 返回登录链接 */}
                                <div className="text-center mt-3">
                                    <NavLink to='/SignIn' className="btn btn-link">
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