import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const Notice_edit: React.FC = () => {
    const { num } = useParams<{ num: string }>();
    const navigate = useNavigate();
    const filePath = "http://localhost:7124/back/uploads/";

    // ✅ 공지사항 상태 관리 (기본 값)
    const [formData, setFormData] = useState({
        noticeNum: 0,
        noticeTitle: "",
        noticeContent: "",
        noticeDate: Date,
        noticeImage: null as File | string | null, // 기존 이미지 OR 새 파일
        noticeHit: 0,
        noticeStatus: "활성"
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    
    // ✅ 기존 데이터 불러오기
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`http://localhost:7124/back/api/notice/getAll/${num}`);
                setFormData(response.data);
            } catch (error) {
                console.error("공지 데이터를 불러오는 중 오류 발생:", error);
            }
        };
        fetchNotice();
    }, [num]);

    // ✅ 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]); // 새로운 파일 저장
        }
    };

    // ✅ 수정된 데이터 전송
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("noticeNum", formData.noticeNum.toString());
        data.append("noticeTitle", formData.noticeTitle);
        data.append("noticeContent", formData.noticeContent);
        data.append("noticeHit", formData.noticeHit.toString());
        data.append("noticeStatus", formData.noticeStatus);
        
        // ✅ 기존 이미지 유지 OR 새 파일 업로드
        if (selectedFile) {
            data.append("img", selectedFile);
        } else if (typeof formData.noticeImage === "string") {
            data.append("noticeImage", formData.noticeImage);
        }

        try {
            const response = await axios.put(`http://localhost:7124/back/api/notice/update/${num}`, data);
            if (response.status === 200) {
                alert("공지사항이 수정되었습니다.");
                navigate("/notice/all");
            }
        } catch (error) {
            console.error("공지 수정 중 오류 발생:", error);
            alert("공지사항 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-32">
            <h2 className="text-2xl font-bold mb-4">공지사항 수정</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">제목</label>
                    <input
                        type="text"
                        name="noticeTitle"
                        className="w-full border border-gray-300 p-2 rounded mt-1"
                        value={formData.noticeTitle}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">내용</label>
                    <textarea
                        name="noticeContent"
                        className="w-full border border-gray-300 p-2 rounded mt-1 h-40"
                        value={formData.noticeContent}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">파일 및 이미지 업로드(1건만 가능)</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 p-2 rounded mt-1"
                        onChange={handleFileChange}
                    />
                    {/* ✅ 기존 이미지 미리보기 */}
                    {formData.noticeImage && typeof formData.noticeImage === "string" && (
                        <img src={`http://localhost:7124/back/uploads/${formData.noticeImage}`} alt="공지 이미지" className="mt-2 w-40 h-auto" />
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-3 py-2 bg-black text-white font-semibold rounded hover:bg-white hover:text-black border border-transparent hover:border-black transition"
                        disabled={loading}
                    >
                        {loading ? "수정 중..." : "수정하기"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Notice_edit;
