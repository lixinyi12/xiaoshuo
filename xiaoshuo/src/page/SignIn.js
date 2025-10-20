import styles from './SignIn.module.css';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import * as authAction from '../actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import * as flashAction from '../actions/flash';
import { useNavigate } from 'react-router-dom';
import api from '../api/index'
import classnames from 'classnames'

const SignIn = () => {
    // 初始化状态
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        errors:{}
    });

    // 处理输入变化（使用计算属性名简化代码）
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
    const handleSubmit =  (e) => {
        e.preventDefault();
        dispatch(
            authAction.asyncSetUserObj({
                username: formData.username,
                password: formData.password
            })
        ).then((res) =>{
            if(res.data.status === 200){
                //登陆成功
                dispatch(flashAction.addFlashMessage({
                    msg: '登陆成功',
                    type: 'success',
                    id:Math.random().toString().slice(2)
                }));
                // 清空表单
                setFormData({
                    username: '',
                    password: '',
                    errors: {}
                });
                //返回首页
                navigate('/', { replace: true });
            }else if(res.data.status === 401){
                //登录失败
                dispatch(flashAction.addFlashMessage({
                    msg: '用户名或密码错误',
                    type: 'danger',
                    id:Math.random().toString().slice(2)
                }));
            }else{
                //表单验证不通过
                setFormData(prevFormData => ({
                    ...prevFormData,
                    errors: res.data.errors
                }));
            }
        }).catch(error =>{
            console.log(error)
        })
    };

    const onBlurCheckUsername = ()=>{
        api.repeatUsername({
            username:formData.username
        }).then(res =>{
            if(res.data.flag){
                //正确
                setFormData(prevFormData => {
                    const newErrors = { ...prevFormData.errors };
                    delete newErrors.username; // 在新对象上操作
                    return {
                        ...prevFormData,
                        errors: newErrors
                    };
                });
            }else{
                //错误
                setFormData(prevFormData=>({
                    ...prevFormData,
                    errors:{
                        ...prevFormData.errors,
                        username:res.data.msg
                    }
                }))
            }
        }).catch(error =>{
            console.log(error)
        })
    }
    const onBlurCheckPassword = ()=>{
        api.repeatPassword({
            password:formData.password
        }).then(res =>{
            if(res.data.flag){
                //正确
                setFormData(prevFormData => {
                    const newErrors = { ...prevFormData.errors };
                    delete newErrors.password; // 在新对象上操作
                    return {
                        ...prevFormData,
                        errors: newErrors
                    };
                });
            }else{
                //错误
                setFormData(prevFormData=>({
                    ...prevFormData,
                    errors:{
                        ...prevFormData.errors,
                        password:res.data.msg
                    }
                }))
            }
        }).catch(error =>{
            console.log(error)
        })
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">用户登录</h3>
                            
                            {/* 垂直表单布局 - Bootstrap默认样式 */}
                            <form role="form" onSubmit={handleSubmit}>
                                {/* 手机号/邮箱输入组 */}
                                <div className="form-group">
                                    <label htmlFor="username" className="col-form-label-lg">
                                        手机号/邮箱
                                    </label>
                                    <input 
                                        type="text"
                                        className={classnames(
                                            `form-control form-control-lg ${styles.formControl}`,
                                            {'is-invalid': formData.errors.username}
                                        )}
                                        id="username"
                                        placeholder="请输入手机号或邮箱地址"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        onBlur={onBlurCheckUsername}
                                    />
                                    {formData.errors.username?<span style={{color:'red'}}>{formData.errors.username}<br></br></span>:''}
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

                                {/* 忘记密码 */}
                                <div className="form-group form-check mt-3">
                                    <NavLink 
                                        to='/ResetPassword' 
                                        className="float-end"
                                        end
                                        >
                                        忘记密码？
                                    </NavLink>
                                </div>

                                {/* 提交按钮 */}
                                <div className="d-grid gap-2 mt-4">
                                    {
                                        Object.keys(formData.errors).length > 0 ?
                                        <button disabled type="submit" className={`btn btn-primary btn-lg ${styles.btn}`}>登录</button> :
                                        <button type="submit" className={`btn btn-primary btn-lg ${styles.btn}`}>登录</button>
                                    }
                                </div>

                                {/* 注册链接 */}
                                <div className="text-center mt-3">
                                    <span>还没有账号？</span>
                                    <NavLink 
                                        to='/SignUp' 
                                        end
                                    >
                                        立即注册
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

export default SignIn;