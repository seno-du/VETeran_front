// src/kakao.d.ts
declare global {
    interface KakaoProfile {
        nickname: string;
        thumbnail_image_url: string;
        profile_image_url: string;
    }

    interface KakaoAccount {
        email: string;
        profile: KakaoProfile;
    }

    interface KakaoUser {
        id: number;
        kakao_account: KakaoAccount;
    }

    interface KakaoAuth {
        access_token: string;
    }

    interface KakaoAPI {
        request: (options: {
            url: string;
            success: (response: unknown) => void;
            fail: (error: unknown) => void;
        }) => void;
    }

    interface Kakao {
        init: (appKey: string) => void;
        Auth: {
            login: (options: KakaoAuthOptions) => void;
        };
        API: { request: (options: KakaoAPIRequestOptions) => void; };
    }

    interface Window {
        Kakao: Kakao;
    }
}

export { };