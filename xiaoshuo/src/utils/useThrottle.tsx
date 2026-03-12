import { useEffect, useRef } from 'react';

/**
 * 
 * @param {需要节流的函数} callback
 * @param {节流时间间隔(ms)} delay
 * @param {依赖项数组，依赖变化时重新创建节流函数} dependencies
 * @returns {Function} 节流后的函数
 */
export const useThrottle = (callback: any, delay: any, dependencies = []) => {
    // 上一次函数执行的时间
    const lastExecTimeRef = useRef(0);
    // 存储定时器ID
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const throttledFunc = (...args: any[]) => {
        const now = Date.now(); // 当前时间

        // 清除上一次未执行的定时器
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // 判断是否超过节流间隔
        if (now - lastExecTimeRef.current >= delay) {
            // 立即执行函数，并更新上一次执行时间
            callback.apply(this, args);
            lastExecTimeRef.current = now;
        } else {
            // 未超过间隔：设置定时器，在剩余时间后执行一次（确保最后一次触发会执行）
            const remainingTime = delay - (now - lastExecTimeRef.current);
            timerRef.current = setTimeout(() => {
                callback.apply(this, args);
                lastExecTimeRef.current = Date.now(); // 更新执行时间为定时器触发时间
                timerRef.current = null;
            }, remainingTime);
        }
    };

    // 组件卸载时清除定时器
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [dependencies]); // 依赖变化时，清除旧的定时器

    return throttledFunc;
};