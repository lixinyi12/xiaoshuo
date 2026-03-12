import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../api';
import { ROUTES } from '../../constants/link';
// @ts-expect-error TS(2307): Cannot find module './AuthorCertification.module.c... Remove this comment to see the full error message
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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
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
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.certificationHeader}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <h1>申请作者认证</h1>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>

      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.formGroup}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <label className={styles.formLabel}>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          真实姓名 <span className={styles.required}>*</span>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </label>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <input
          type="text"
          name="realName"
          value={formData.realName}
          onChange={handleInputChange}
          placeholder="请输入真实姓名"
          className={styles.formInput}
          required
        />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>

      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.formGroup}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <label className={styles.formLabel}>
          笔名
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </label>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <input
          type="tel"
          name="penName"
          value={formData.penName}
          onChange={handleInputChange}
          placeholder="请输入你的笔名"
          className={styles.formInput}
          required
        />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>

      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.formGroup}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <label className={styles.formLabel}>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          身份证号 <span className={styles.required}>*</span>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </label>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleInputChange}
          placeholder="请输入身份证号码"
          className={styles.formInput}
          required
        />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>

      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.formGroup}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <label className={styles.formLabel}>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          手机号码 <span className={styles.required}>*</span>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </label>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="请输入手机号码"
          className={styles.formInput}
          required
        />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
      
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.formGroup}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <label className={styles.formLabel}>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          邮箱 <span className={styles.required}>*</span>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </label>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <input
          type="tel"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="请输入邮箱"
          className={styles.formInput}
          required
        />
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>

      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={styles.formActions}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <button
          type="button"
          onClick={handleSubmit}
          className={`${styles.btn} ${styles.btnPrimary} ${styles.submitBtn}`}
        >
          提交申请
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </button>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    </div>
  );
};

export default AuthorCertification;