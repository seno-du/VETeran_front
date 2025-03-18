import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Notice {
    noticeNum: number;
    noticeTitle: string;
    noticeContent: string;
    noticeDate: Date;
    noticeImage: string | null;
    noticeHit: number;
    noticeStatus: string;
}

const Notice_detail: React.FC = () => {
    const { num } = useParams<{ num: string }>();  // 파라미터 이름을 "num"으로 변경
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const filePath = "http://localhost:7124/back/uploads/";

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get<Notice>(`http://localhost:7124/back/api/notice/detail/${num}`);
                console.log("API Response:", response.data);  // 응답 확인
                setNotice(response.data);
                setLoading(false);
            } catch (error) {
                console.error("공지사항 데이터를 가져오는 중 오류 발생:", error);
                setError("공지사항을 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchNotice();
    }, [num]);

    const handleDelete = async () => {
        try {
            await axios.put(`http://localhost:7124/back/api/notice/status/${num}`);
            alert("공지사항이 삭제되었습니다.");
            setNotice(prevNotice => prevNotice ? { ...prevNotice, noticeStatus: "삭제됨" } : null);  // 공지사항 상태를 '삭제됨'으로 업데이트

            navigate("/notice/all");  // 삭제 후 공지사항 목록 페이지로 이동
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            setError("공지사항 삭제에 실패했습니다.");
        }
    };

    const formatDate = (noticeDate: Date) => {
        const date = new Date(noticeDate);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      };

    if (loading) return <div className="text-center">로딩 중...</div>;
    if (error) return <div className="text-red-500 text-center font-bold">{error}</div>;
    if (!notice) return <div className="text-center">공지사항을 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
            {/* 🔹 공지사항 제목 & 정보 */}
            <h2 className="text-2xl font-bold mb-4">{notice.noticeTitle}</h2>
            <div className="flex items-center text-gray-500 text-sm mb-6">
                <span className="mr-4">📅 등록일: {formatDate(notice.noticeDate)}</span>
                <span>👀 조회수: {notice.noticeHit}</span>
            </div>

            {/* 🔹 공지 이미지 (있으면 표시) */}
            {notice.noticeImage && (
                <div className="mb-6">
                    <img
                        src={`${filePath}${notice.noticeImage}`}
                        alt="공지 이미지"
                        className="w-full object-cover rounded-md mb-8"
                    />
                </div>
            )}

            {/* 공지 내용 */}
            <p className="text-lg leading-relaxed mb-8">{notice.noticeContent}</p>

            <div className="flex justify-end mt-6 space-x-4"> {/* 여기서 space-x-4는 버튼 사이의 간격을 지정합니다. */}
                {/* <button
                    onClick={() => navigate(`/notice/getAll/${num}`)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black"
                >
                    수정
                </button>

                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black"
                >
                    삭제
                </button> */}

                <button
                    onClick={() => navigate("/notice/all")}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black"
                >
                    목록
                </button>
            </div>


        </div>
    );
};

export default Notice_detail;
