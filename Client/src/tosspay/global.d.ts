// src/global.d.ts

declare global {
    // 결제 정보를 담는 타입
    interface PaymentInfo {
        amount: number;
        orderId: string;
        orderName: string;
        customerName: string;
        [key: string]: unknown; // 추가적인 파라미터를 unknown으로 정의
    }

    // TossPayments 객체를 함수로 정의
    interface TossPayments {
        (clientKey: string): {
            requestPayment: (
                paymentMethod: '카드' | '계좌이체' | '가상계좌' | '휴대폰',
                paymentInfo: PaymentInfo
            ) => Promise<{
                success: boolean;
                paymentKey: string;
                orderId: string;
            }>;
        };
    }

    interface Window {
        TossPayments: TossPayments; // window에 TossPayments 객체를 함수 형태로 정의
    }
}

export { }; // 빈 export 구문 추가
