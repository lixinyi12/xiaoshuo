// Button.js
import React from 'react';
import PropTypes from 'prop-types'; // 用于属性类型检查
import styles from './Button.module.css'; // 导入CSS Modules样式文件（如果使用）

/**
 * 一个可复用的按钮组件
 * @param {Object} props - 组件的属性
 * @param {string} props.label - 按钮上显示的文字
 * @param {function} props.onClick - 点击按钮时触发的回调函数
 * @param {string} [props.type='button'] - 按钮的HTML类型（如 'button', 'submit', 'reset'）
 * @param {boolean} [props.disabled=false] - 按钮是否被禁用
 * @param {string} [props.variant='primary'] - 按钮的样式变体（如 'primary', 'secondary', 'danger'）
 * @param {string} [props.className=''] - 额外的自定义CSS类名
 * @param {Object} [props.rest] - 其他会被传递给button元素的属性（如`data-*`, `aria-*`等）
 */
const Button = ({ 
  label, 
  onClick, 
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
  ...rest // 收集其他传递给按钮的属性
}) => {

  // 动态构建className字符串
  // 如果使用CSS Modules，可以像这样：`${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''} ${className}`
  // 这里以常规CSS类名为例
  const buttonClasses = `btn btn--${variant} ${disabled ? 'btn--disabled' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses} // 或者使用CSS Modules: className={styles.filterBtn} 等
      onClick={onClick}
      disabled={disabled}
      aria-label={label} // 提升可访问性
      {...rest} // 将其他属性（如data-testid）展开到button上
    >
      {label}
    </button>
  );
};

// 属性类型检查，有助于在开发阶段发现错误
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'text']), // 可根据需要扩展
  className: PropTypes.string,
};

// 默认属性值
Button.defaultProps = {
  type: 'button',
  disabled: false,
  variant: 'primary',
  className: '',
  onClick: () => {}, // 提供一个空函数作为默认点击处理，防止未定义错误
};

export default Button;