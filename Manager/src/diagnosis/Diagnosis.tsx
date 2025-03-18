import axios from "axios";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const Diagnosis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 진단 중 상태 변수 추가

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDiagnosis = async () => {
    if (!selectedFile) return alert("파일을 선택하세요.");
    if (!selectedCategory) return alert("진단 유형을 선택하세요.");

    setIsLoading(true); // 진단 시작 시 로딩 상태로 설정

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("diagnosis_type", selectedCategory);

    try {
      const response = await axios.post("http://localhost:8000/diagnosis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data, "예측 데이터");

      if (response.data) {
        setDiagnosis(response.data.result || "진단 결과를 받아오지 못했습니다.");
        alert("진단 결과가 예측되었습니다.");
      }
    } catch (error) {
      console.error("진단 요청 실패:", error);
      alert("진단 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 진단 완료 후 로딩 상태 해제
    }
  };

  // 예측 결과
  const getBorderColor = (diagnosis: string | null) => {
    if (!diagnosis) return '';
    if (diagnosis === 'NOR') return 'border-green-500';
    if (diagnosis === 'ABN' || diagnosis === 'Mu05')
      return 'border-red-500';
    return '';
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">AI 기반 X-Ray 진단</h1>

      <select
        value={selectedCategory || ""}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 mb-4 border rounded-md"
      >
        <option value="" disabled>의심되는 병명을 선택하세요</option>
        <option value="ch">흉부</option>
        <option value="mu">근골격계</option>
      </select>

      {selectedCategory && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          {previewUrl && (
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
              <img
                src={previewUrl}
                alt="엑스레이 미리보기"
                className="w-[48rem] h-[48rem] object-cover rounded-md mb-4"
              />
              <button
                onClick={handleDiagnosis}
                className="flex items-center px-4 py-2 mt-4 text-white bg-teal-600 rounded-md"
                disabled={isLoading} // 로딩 중일 때 버튼 비활성화
              >
                {isLoading ? "진단 중..." : "진단하기"} <FaArrowRight className="ml-2" />
              </button>
            </div>
          )}
        </>
      )}

      {diagnosis && (
        <div
          className={`mt-4 text-lg font-semibold p-4 ${getBorderColor(diagnosis)} border-4 rounded-md`}
        >
          진단 결과: {diagnosis}
        </div>
      )}
    </div>
  );
};

export default Diagnosis;