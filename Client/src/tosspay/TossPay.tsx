import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

interface Reserve {
    time: Date,
    pet: {
        icon: "🐶",
        petBirth: Date,
        petColor: string,
        petGender: string,
        petImage: string,
        petMicrochip: string,
        petName: string,
        petNum: number,
        petSpecies: string,
        petWeight: number,
        userNum: number
    },
    note: string,
    doctor: {
        department: string,
        doctor: [
            managerName: string,
            managerNum: number,
        ],
        image: string,
        note: string,
        specialty: string
    },
}

function getKoreanTimeNow() {
    const koreanTime = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    return koreanTime;
}

const TossPay: React.FC<Reserve> = ({ time, pet, note, doctor }) => {
    console.log(time, pet, note, doctor);

    const clientKey = import.meta.env.VITE_TOSS_KEY; // 토스 테스트 클라이언트 키
    const token = useSelector((state: any) => state.auth.token);
    const navigate = useNavigate();

    const [orderId, setOrderId] = useState('');
    const [userNum, setUserNum] = useState(0);

    const User = async () => {
        const response = await axios.get(`http://localhost:7124/back/api/user/one`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setUserNum(response.data.userNum);
    }

    // 외부 스크립트 동적 로드
    const loadTossPaymentsScript = () => {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.tosspayments.com/v1/payment';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('TossPayments SDK 로드 실패'));
            document.head.appendChild(script);
        });
    };

    // 결제 요청 및 결제 처리
    const PaymentInsert = async (reserveNum: number) => {
        try {
            const response = await axios.post(`http://localhost:7124/back/api/paymentrequest`, {
                paymentMethod: "간편결제",
                amount: 20000,
                reserveNum: reserveNum,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setOrderId(response.data.orderId);

            if (response.status === 200) {
                if (window.TossPayments) {
                    const tossPayments = window.TossPayments(clientKey);
                    tossPayments
                        .requestPayment('카드', {
                            amount: 20000,
                            orderId: response.data.orderId,
                            orderName: 'Vet병원 예약',
                            customerEmail: response.data.userEmail,
                            customerName: response.data.userName,
                            customerMobilePhone: response.data.userPhone,
                        })
                        .then((response) => {
                            PaymentErrorCheck(response.paymentKey, reserveNum);
                        })
                        .catch((error) => {
                            console.error(error);
                            PaymentUpdateState("취소됨", "error", reserveNum, "취소");
                        });
                } else {
                    console.error('TossPayments SDK가 로드되지 않았습니다.');
                    PaymentUpdateState("취소됨", "error", reserveNum, "취소");
                }
            }
        } catch (error) {
            console.error(error);
            PaymentUpdateState("취소됨", "error", reserveNum, "취소");
        }
    }

    // 결제 신용카드 이상거래 확인
    const PaymentErrorCheck = async (paymentKey: string, reserveNum: number) => {

        console.log(paymentKey, reserveNum)
        try {
            await axios.post(`http://127.0.0.1:8000/payment/paymentandip`, {
                "거래번호": orderId,
                "거래내용": "예약",
                "금액": 20000,
                "거래방법": "카드결제",
                "해외거래": false,
                "결제일시": getKoreanTimeNow(),
                "userNum": userNum
            });

            PaymentUpdateState("완료됨", paymentKey, reserveNum, "대기");
        } catch (error) {
            console.error(error);
            PaymentUpdateState("취소됨", "error", reserveNum, "취소");
        }
    }

    // 결제 상태 업데이트 (성공/실패)
    const PaymentUpdateState = async (state: string, paymentKey: string, reserveNum: number, reserveState: string) => {
        try {

            if (state === "예약취소") {
                alert("예약 시도중 취소되었습니다.");
                return
            }

            await axios.post(`http://localhost:7124/back/api/paymentrequest/updateState`, {
                state: state,
                paymentKey: paymentKey,
                reserveNum: reserveNum,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await axios.post('http://localhost:7124/back/api/reserve/updateState', { reserveStatus: reserveState, reserveNum: reserveNum }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await axios.post('http://localhost:7124/back/api/chart/save', { reserveNum }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (state === "완료됨" && reserveState === "대기" && paymentKey !== null) {
                alert("예약이 완료되었습니다.");
                // time, pet, note, doctor
                console.log(doctor.department, doctor, time, pet, note)
                navigate("/reservation_completed", { state: { department: doctor.department, doctor: doctor, time: time, pet: pet, note: note } });
            } else {
                alert("예약이 취소되었습니다.");
            }
        } catch (error) {
            console.error("결제 상태 업데이트 실패", error);
        }
    }

    // 예약 상태 저장
    const ReserveSave = async () => {

        console.log(time)

        const requestData = {
            managerNum: doctor.doctor.managerNum,
            petNum: String(pet.petNum),
            reserveDate: `${time.selectedDate} ${time.selectedTime}:00`,
            reserveNotice: note || ""
        };
        console.log(requestData)
        const response = await axios.post("http://localhost:7124/back/api/reserve/reservation",
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (response.status === 200) {
            PaymentInsert(response.data.reserveNum);
        } else {
            PaymentUpdateState("예약취소", "error", response.data.reserveNum, "취소");
        }
    };

    // 컴포넌트가 마운트 될 때 사용자 정보와 결제 스크립트 로드
    useEffect(() => {
        console.log("time:", time, "pet:", pet, "note:", note, "doctor:", doctor)
        console.log(token)
        User();
        loadTossPaymentsScript()
            .then(() => {
                // 성공적으로 로드됨
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <button
                onClick={ReserveSave}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
                결제 진행
            </button>
        </div>
    );
};

export default TossPay;
