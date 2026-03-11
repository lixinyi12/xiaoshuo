import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../api';
import { ROUTES } from '../../constants/link';
import styles from './AuthorCertification.module.css';

const AuthorCertification = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    realName: '',
    idNumber: '',
    phone: '',
    email: '',
    penName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.realName.trim()) {
      alert('请输入真实姓名');
      return;
    }
    if (!formData.idNumber.trim()) {
      alert('请输入身份证号');
      return;
    }
    if (!formData.phone.trim()) {
      alert('请输入手机号码');
      return;
    }
    if (!formData.email.trim()) {
      alert('请输入手机号码');
      return;
    }

    const submitData = {
      realName: formData.realName,
      idNumber: formData.idNumber,
      phone: formData.phone,
      email: formData.email,
      penName: formData.penName
    };

    applicationApi.addApplication(submitData)
      .then(() => {
        alert('认证申请已提交，请等待管理员审核');
        navigate(ROUTES.PERSON);
      })
      .catch(err => {
        alert('提交失败：' + err.message);
      });
  };

  return (
    <div className={styles.authorCertificationContainer}>
      <div className={styles.certificationHeader}>
        <h1>申请作者认证</h1>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          真实姓名 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="realName"
          value={formData.realName}
          onChange={handleInputChange}
          placeholder="请输入真实姓名"
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          笔名
        </label>
        <input
          type="tel"
          name="penName"
          value={formData.penName}
          onChange={handleInputChange}
          placeholder="请输入你的笔名"
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          身份证号 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleInputChange}
          placeholder="请输入身份证号码"
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          手机号码 <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="请输入手机号码"
          className={styles.formInput}
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          邮箱 <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="请输入邮箱"
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={handleSubmit}
          className={`${styles.btn} ${styles.btnPrimary} ${styles.submitBtn}`}
        >
          提交申请
        </button>
      </div>
    </div>
  );
};

export default AuthorCertification;