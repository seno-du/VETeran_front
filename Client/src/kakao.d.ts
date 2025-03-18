// src/kakao.d.ts

interface KakaoAuthOptions {
    scope: string;  // 권한 범위
    success: (authObj: { access_token: string }) => void;  // 로그인 성공 시 처리
    fail: (error: Error) => void;  // 로그인 실패 시 처리
}

interface KakaoAPIRequestOptions {
    url: string;
    success: (response: { kakao_account: { profile: { nickname: string }; email: string } }) => void;
    fail: (error: Error) => void;
}

interface Kakao {
    init: (appKey: string) => void;
    Auth: {
        login: (options: KakaoAuthOptions) => void;
    };
    API: {
        request: (options: KakaoAPIRequestOptions) => void;
    };
}

interface Window {
    Kakao: Kakao;
}
