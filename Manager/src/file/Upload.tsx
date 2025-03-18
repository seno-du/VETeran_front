import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

// 🔥 카테고리 번호 매핑
const categoryMap: { [key: string]: number } = {
    "내과 & 영상의학과": 1,
    "심장 & 신장 내외과": 2,
    "외과 & 마취과": 3,
    "치과 & 안과": 4,
    "피부과 & 면역과": 5,
    "정형외과 & 재활의학과": 6,
    "종양학 & 혈액학": 7
};

const categories = Object.keys(categoryMap); // 카테고리 목록
const token = sessionStorage.getItem("accessToken");

const Upload: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");

    const [formData, setFormData] = useState({
        mfileNum: 0,
        mfileDate: '',
        mfileTitle: '',
        mfileContent: '',
        mfileName: null as File | null,
        mfileRealName: null as File | null,
        mfileCategory: 0, // 🔥 숫자로 저장
        mfileStatus: '활성화'
    });

    // 🔥 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
            setFileName(file.name);
            setFormData((prev) => ({
                ...prev,
                mfileName: file
            }));
        }
    };

    // 🔥 카테고리 선택 핸들러 (String → Number 변환 후 저장)
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            mfileCategory: categoryMap[e.target.value] || 0 // 🔥 문자열을 숫자로 변환
        }));
    };

    // 파일 업로드
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert("파일 업로드 완료!");

        const token = sessionStorage.getItem("accessToken");
        const data = new FormData();
        data.append('mfileNum', formData.mfileNum.toString());
        data.append('mfileTitle', formData.mfileTitle);
        data.append('mfileContent', formData.mfileContent);
        data.append('mfileCategory', formData.mfileCategory.toString());
        data.append('mfileStatus', formData.mfileStatus);

        if (formData.mfileName) {
            data.append("mFile", formData.mfileName);
        }

        try {
            const response = await axios.post(
                'http://localhost:7124/back/api/mfile/add',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${token}}`
                    },
                }
            );
            if (response.status === 200) {
                alert('파일이 성공적으로 추가되었습니다!');
                navigate('/mfile/all', { state: { reload: true } });
            }
        } catch (error) {
            console.error('파일 업로드 중 오류 발생:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-100 to-white-300 min-h-screen text-black p-6">
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">파일 업로드 게시글</h2>
                <form onSubmit={handleSubmit} className="space-y-4">


                    <div>
                        {/* 🔥 제목 입력 */}
                        <div>
                            <label className="block text-gray-600">제목</label>
                            <textarea
                                value={formData.mfileTitle}
                                onChange={(e) => setFormData((prev) => ({
                                    ...prev,
                                    mfileTitle: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                                rows={1}
                                placeholder="제목을 입력하세요."
                            ></textarea>
                        </div>
                        {/* 🔥 카테고리 선택 (값 유지됨) */}
                        <label className="block text-gray-600">카테고리</label>
                        <select
                            value={categories.find(cat => categoryMap[cat] === formData.mfileCategory) || ""}
                            onChange={handleCategoryChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">선택</option>
                            {categories.map((cat) => (
                                <option key={categoryMap[cat]} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* 🔥 내용 입력 */}
                    <div>
                        <label className="block text-gray-600">내용</label>
                        <textarea
                            value={formData.mfileContent}
                            onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                mfileContent: e.target.value
                            }))}
                            className="w-full p-2 border rounded"
                            rows={3}
                            placeholder="내용을 입력하세요."
                        ></textarea>
                    </div>
                    {/* 🔥 파일 업로드 */}
                    <div>
                        <label className="block text-gray-600">파일 업로드</label>
                        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
                        {file && (
                            <p className="text-sm text-gray-600 mt-2">선택된 파일: {fileName}</p>
                        )}
                    </div>
                    {/* 🔥 등록 버튼 */}
                    <button
                        type="submit"
                        className="w-1/8 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center"
                    >
                        등록
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
