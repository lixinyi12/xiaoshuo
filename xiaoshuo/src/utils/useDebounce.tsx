import { useEffect, useRef } from 'react';
/**
 * 
 * @param {需要防抖的值} value 
 * @param {延迟时间(ms)} delay 
 * @param {值变化后的回调函数} callback 
 */
export const useDebounce = (value: any, delay: any, callback: any) => {
    // 用useRef存储定时器ID，确保组件重新渲染时不会丢失定时器引用
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        // 每次value变化时，先清除上一次的定时器
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // 延迟delay毫秒后执行回调
        timerRef.current = setTimeout(() => {
            // 回调函数传入当前最新的value（避免闭包问题）
            callback(value);
        }, delay);

        // 组件卸载时清除定时器
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value, delay, callback]);
};