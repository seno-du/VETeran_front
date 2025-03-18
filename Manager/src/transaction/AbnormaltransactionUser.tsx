import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { format } from 'date-fns';

interface Card {
    userNum: number;
    cardNum: number;
    cardFirstDate: string;  // 문자열로 변경
    cardState: string;
    cardCompany: string;
}

const AbnormaltransactionUser: React.FC = () => {

    const { userNum } = useParams<{ userNum: string }>();

    const [userNM, setUserNM] = useState('');
    const [card, setCard] = useState<Card[]>([]);

    const userCard = async () => {
        const response = await axios.get(`http://localhost:7124/back/api/card/mycard/${userNum}`);
        setCard(response.data);
    };

    const User = async () => {
        const response = await axios.get(`http://localhost:7124/back/api/user/one/${userNum}`);
        setUserNM(response.data.userName);
    };

    useEffect(() => {
        if (userNum) {
            userCard();
            User();
        }
    }, [userNum]);  // userNum 변경 시 다시 API 호출

    const formatDate = (date: string) => {
        const dateObj = new Date(date);  // 문자열을 Date 객체로 변환
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
            return format(dateObj, 'yyyy-MM-dd HH:mm:ss'); // 날짜와 시간, 초까지 출력
        }
        return '';
    };

    const cardStateChange = async (num: number, state: string) => {
        try {
            // 상태 변경 API 호출
            const data = { cardNum: num, cardState: state };
            await axios.post(`http://localhost:7124/back/api/card/updatecardstate`, data);
            alert(`카드 상태가 ${state}로 변경되었습니다.`);
            // 카드 상태 업데이트 (프론트에서)
            setCard((prevCardList) =>
                prevCardList.map((card) =>
                    card.cardNum === num ? { ...card, cardState: state } : card
                )
            );
        } catch (error) {
            console.error('카드 상태 변경 실패:', error);
            alert(`카드 상태 변경중 오류가 발생했습니다.`)
        }
    };

    const onStateCard = (num: number, state: string) => {
        const newState = state === '활성' ? '비활성' : '활성';
        if (window.confirm(`카드를 ${newState === '활성' ? '활성화' : '비활성화'} 시키시겠습니까?`)) {
            cardStateChange(num, newState);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* 사용자 카드 정보 */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <div className="justify-center text-xl font-semibold">{userNM} 님의 카드</div>
                <div className="text-gray-500">카드 수: {card.length}</div>
            </div>

            {/* 카드 리스트 출력 (동적 레이아웃) */}
            <div
                className={`grid ${card.length === 1
                    ? "grid-cols-1 place-items-center" // 1개 카드: 중앙 정렬
                    : card.length === 2
                        ? "grid-cols-2 gap-6" // 2개 카드: 좌우 정렬
                        : card.length === 3
                            ? "grid-cols-3 gap-6" // 3개 카드: 좌측, 중앙, 우측 정렬
                            : card.length === 4
                                ? "grid-cols-2 grid-rows-2 gap-6" // 4개 카드: 2x2 배치 (왼위, 오위, 왼아, 오아)
                                : "grid-cols-3 place-items-center"
                    }`}
            >
                {card.map((card) => (
                    <div
                        key={card.cardNum}
                        className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                        {/* 카드 내용 */}
                        <div className="flex flex-col space-y-2 text-gray-800">
                            <div className="text-lg font-bold">카드번호 : {card.cardNum}</div>
                            <div className="text-lg font-bold">카드사 : {card.cardCompany}</div>
                            <div className="text-sm">등록 날짜 : {formatDate(card.cardFirstDate)}</div>
                        </div>

                        {/* 카드 하단 */}
                        <div className="mt-4 text-center text-gray-600">
                            <button onClick={() => onStateCard(card.cardNum, card.cardState)}>
                                <p className="text-sm font-semibold">{card.cardState}</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AbnormaltransactionUser;
