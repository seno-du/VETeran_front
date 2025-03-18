import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Notice_write: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    noticeNum: 0,
    noticeDate: '',
    noticeTitle: '',
    noticeContent: '',
    noticeImage: null as File | null, // 파일 데이터를 저장
    noticeHit: 0,
    noticeStatus: '활성'
  });


  console.log("token", token);
  // 🔥 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        noticeImage: files[0] // ✅ null 체크 후 단일 파일 저장
      }));
    }
  };


  // 🔥 파일 업로드 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("파일 업로드 완료!");

    const data = new FormData();
    data.append('noticeNum', formData.noticeNum.toString());
    data.append('noticeTitle', formData.noticeTitle); // 제목
    data.append('noticeContent', formData.noticeContent); // 내용
    data.append('noticeHit', formData.noticeHit.toString()); //조회수
    data.append('noticeStatus', formData.noticeStatus); // 상태
    // 파일이 있는 경우에만 추가
    if (formData.noticeImage) {
      data.append("img", formData.noticeImage); // 한 장만 업로드 가능
    }

    try {
      const response = await axios.post(
        'http://localhost:7124/back/api/notice/add',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}}`
          },
        }
      );
      if (response.status === 200) {
        alert('공지사항이 성공적으로 추가되었습니다!');
        navigate('/notice/all', { state: { reload: true } });
      }
    } catch (error) {
      console.error('공지사항 작성 중 오류 발생:', error);
      alert('공지사항 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white-300 min-h-screen text-black p-6">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">공지사항 게시</h2>
        <form onSubmit={handleSubmit} className="space-y-4">


          <div>
            {/* 🔥 제목 입력 */}
            <div>
              <label className="block text-gray-600">제목</label>
              <textarea
                value={formData.noticeTitle}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  noticeTitle: e.target.value
                }))}
                className="w-full p-2 border rounded"
                rows={1}
                placeholder="제목을 입력하세요."
              ></textarea>
            </div>
          </div>

          {/* 🔥 내용 입력 */}
          <div>
            <label className="block text-gray-600">내용</label>
            <textarea
              value={formData.noticeContent}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                noticeContent: e.target.value
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

export default Notice_write;
