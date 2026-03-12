import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={`${styles.footer} navbar-dark`}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.col}>
            <h5>关于我们</h5>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>网站简介</a></li>
              <li><a href="#" className={styles.link}>联系我们</a></li>
              <li><a href="#" className={styles.link}>加入我们</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h5>帮助中心</h5>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>用户指南</a></li>
              <li><a href="#" className={styles.link}>常见问题</a></li>
              <li><a href="#" className={styles.link}>反馈建议</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h5>友情链接</h5>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>起点中文网</a></li>
              <li><a href="#" className={styles.link}>纵横中文网</a></li>
              <li><a href="#" className={styles.link}>晋江文学城</a></li>
            </ul>
          </div>
        </div>
        <hr className={styles.divider} />
        <p className={styles.copyright}>&copy; 2025 精品小说阅读网. 版权所有.</p>
      </div>
    </footer>
  );
}

export default Footer;