// src/types/aria-query.d.ts

// 声明 'aria-query' 模块，让 TypeScript 知道它是一个有效的模块
declare module 'aria-query' {
    // 这里你可以根据需要添加一些基本的、常用的类型导出
    // 例如，如果你的代码中只用到了某个特定的 API，可以在这里声明
    // 如果暂时不清楚，最简单的做法是导出一个空对象或 any 类型，
    // 这样就能立即消除编译错误。
    export const something: any; // 一个简单的占位符
}