// src/global.d.ts

declare global {
    interface Window {
        Kakao: unknown;  // Kakao 객체를 window 객체에 추가
    }
}

// 이 파일을 사용하려면 반드시 'export {}'를 추가해야 합니다.
export { };