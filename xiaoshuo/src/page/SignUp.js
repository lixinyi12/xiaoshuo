import styles from './SignUp.module.css';
import { BrowserRouter as Router, Route, Routes, Link, NavLink, replace } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../api/index'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux';
import { addFlashMessage } from '../actions/flash';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/link';

const SignUp = () => {

    // 初始化状态
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: '',
        password2: '',
        errors:{}
    });

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData, // 保留其他字段的值
        [name]: value // 动态更新当前改变的字段
        });
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 处理表单提交
    const handleSubmit = (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        api.register(
            {
                phone:formData.phone,
                email:formData.email,
                password:formData.password,
                password2:formData.password2
            }
        ).then(res =>{
            if(res.data.status === 200){
                //注册成功
                dispatch(addFlashMessage({
                    msg: res.data.msg,
                    type: 'success',
                    id:Math.random().toString().slice(2)
                }));
                // 清空表单
                setFormData({
                    phone: '',
                    email: '',
                    password: '',
                    password2: '',
                    errors: {}
                });
                //返回登录
                navigate(ROUTES.SIGNIN, { replace: true });
            }else if(res.data.status == 400){
                //表单验证不通过
                setFormData(prevFormData => ({
                    ...prevFormData,
                    errors: res.data.errors
                }));
            }else if(res.data.status == 401){
                //注册失败
                dispatch(addFlashMessage({
                    msg: '注册失败',
                    type: 'danger',
                    id:Math.random().toString().slice(2)
                }));
            }
        }).catch(error =>{
            console.log(error)
        })
    };
    const onBlurCheckEmail = ()=>{
        
    }
    const onBlurCheckPhone = ()=>{
        
    }
    const onBlurCheckPassword = ()=>{
        
    }
    const onBlurCheckPassword2 = ()=>{
        
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">用户注册</h3>
                            
                            {/* 垂直表单布局 - Bootstrap默认样式 */}
                            <form role="form" onSubmit={handleSubmit}>
                                {/* 手机号输入组 */}
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label-lg">
                                        手机号
                                    </label>
                                    <input 
                                        type="text" 
                                        className={classnames(
                                            `form-control form-control-lg ${styles.formControl}`,
                                            {'is-invalid': formData.errors.phone}
                                        )}
                                        id="phone"
                                        placeholder="请输入手机号"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        onBlur={onBlurCheckPhone}
                                    />
                                    {formData.errors.phone?<span style={{color:'red'}}>{formData.errors.phone}<br></br></span>:''}
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
                                        className={classnames(
                                            `form-control form-control-lg ${styles.formControl}`,
                                            {'is-invalid': formData.errors.email}
                                        )}
                                        id="email"
                                        placeholder="请输入邮箱地址"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={onBlurCheckEmail}
                                    />
                                    {formData.errors.email?<span style={{color:'red'}}>{formData.errors.email}<br></br></span>:''}
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
                                        className={classnames(
                                            `form-control form-control-lg ${styles.formControl}`,
                                            {'is-invalid': formData.errors.password}
                                        )}
                                        id="password"
                                        placeholder="请输入密码"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={onBlurCheckPassword}
                                    />
                                    {formData.errors.password?<span style={{color:'red'}}>{formData.errors.password}<br></br></span>:''}
                                </div>

                                {/* 密码重新输入组 */}
                                <div className="form-group mt-3">
                                    <label htmlFor="password" className="col-form-label-lg">
                                        重新输入密码
                                    </label>
                                    <input 
                                        type="password" 
                                        className={classnames(
                                            `form-control form-control-lg ${styles.formControl}`,
                                            {'is-invalid': formData.errors.password2}
                                        )}
                                        id="password2"
                                        placeholder="请重新输入密码"
                                        name="password2"
                                        value={formData.password2}
                                        onChange={handleInputChange}
                                        onBlur={onBlurCheckPassword2}
                                    />
                                    {formData.errors.password2?<span style={{color:'red'}}>{formData.errors.password2}<br></br></span>:''}
                                </div>

                                {/* 提交按钮 */}
                                <div className="d-grid gap-2 mt-4">
                                    {
                                        Object.keys(formData.errors).length > 0 ?
                                        <button disabled type="submit" className={`btn btn-primary btn-lg ${styles.btn}`}>注册</button> :
                                        <button type="submit" className={`btn btn-primary btn-lg ${styles.btn}`}>注册</button>
                                    }
                                </div>

                                {/* 注册链接 */}
                                <div className="text-center mt-3">
                                    <span>已经注册过账号？</span>
                                    <NavLink 
                                        to={ROUTES.SIGNIN} 
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