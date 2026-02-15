import React, { useState, useCallback, useEffect } from 'react';
import styles from './PersonalInfo.module.css';
import api from '../api'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/link';

const PersonalInfo = () => {
  // 用户信息状态管理
  const [user,setUser] = useState({
    nick: '暂无昵称',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    gender: 'male',
    birthday: '1990-01-01',
    desc: '这个人很忙，没有留下自我介绍。'
  })
  const token = localStorage.getItem('TOKEN')
  const navigate = useNavigate()

  useEffect(()=>{
    api.user({token}).then(res=>{
        setUser(res.data.result)
    })
  },[])

  // 头像上传状态
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // 处理输入框变化
  const handleInputChange = useCallback((field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 头像上传处理
  const handleAvatarUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 文件类型验证
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('请上传JPEG、PNG或GIF格式的图片');
      return;
    }

    // 文件大小限制（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('文件大小不能超过5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({
          ...prev,
          avatar: e.target.result
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // 实际项目中这里应该上传到服务器
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
    } catch (error) {
      setUploadError('上传失败，请重试');
      setIsUploading(false);
    }
  }, []);

  // 表单提交处理
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      // 表单验证可以在这里进行
      // console.log('提交的用户信息:', user);
      
      // 模拟API调用
      // const response = await updateuser(user);
      const response = await api.changePersonalInfo({
        nick:user.nick, 
        phone:user.phone, 
        email:user.email, 
        gender:user.gender, 
        birthday:user.birthday, 
        desc:user.desc
      })
      
      alert('个人信息更新成功！');
    } catch (error) {
      // console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      navigate(ROUTES.PERSON,{replace:true})
    }
  }, [user]);

  const handleCancel = useCallback(() => {
    // 重置表单或返回上一页
    navigate(ROUTES.PERSON, { replace: true });
  }, []);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>个人信息修改</h1>
      </div>
      
      <div className={styles.profileContent}>
        {/* 头像上传区域 */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <img 
              src={user.avatar} 
              alt="用户头像" 
              className={styles.avatar}
              onClick={() => document.getElementById('avatarUpload').click()}
            />
            {isUploading && (
              <div className={styles.uploadOverlay}>
                <div className={styles.loadingSpinner}>上传中...</div>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="avatarUpload"
            className={styles.avatarUpload} 
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
          <p className={styles.uploadHint}>点击头像上传新照片</p>
          {uploadError && (
            <p className={styles.errorMessage}>{uploadError}</p>
          )}
        </div>
        
        {/* 表单区域 */}
        <form id="profileForm" onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* 昵称 */}
            <div className={styles.formGroup}>
              <label htmlFor="name">昵称</label>
              <input 
                type="text" 
                id="name"
                name="name"
                required 
                value={user.nick}
                onChange={(e) => handleInputChange('nick', e.target.value)}
              />
            </div>
            
            {/* 邮箱 */}
            <div className={styles.formGroup}>
              <label htmlFor="email">电子邮箱</label>
              <input 
                type="email" 
                id="email"
                name="email"
                required 
                value={user.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            {/* 手机号码 */}
            <div className={styles.formGroup}>
              <label htmlFor="phone">手机号码</label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={user.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            {/* 性别选择 */}
            <div className={styles.formGroup}>
              <label>性别</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="男" 
                    checked={user.gender === '男'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  /> 
                  男
                </label>
                <label className={styles.radioOption}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="女" 
                    checked={user.gender === '女'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  /> 
                  女
                </label>
              </div>
            </div>
            
            {/* 出生日期 */}
            <div className={styles.formGroup}>
              <label htmlFor="birthday">出生日期</label>
              <input 
                type="date" 
                id="birthday"
                name="birthday"
                value={user.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
              />
            </div>
            
            {/* 个性签名 */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="bio">个性签名</label>
              <textarea 
                id="bio"
                name="bio"
                rows="4" 
                placeholder="介绍一下你自己..."
                value={user.desc}
                onChange={(e) => handleInputChange('desc', e.target.value)}
              />
            </div>
            
            {/* 表单操作按钮 */}
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={handleCancel}
              >
                取消
              </button>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={isUploading}
              >
                {isUploading ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;