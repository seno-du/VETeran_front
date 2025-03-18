import React, { useState } from "react";
import axios from "axios";

const FaceVerification = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);

    // 이미지 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // 얼굴 인증 요청
    const handleVerify = async () => {
        if (!image) {
            alert("이미지를 선택하세요!");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://localhost:5000/verify", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setResult(response.data);
        } catch (error) {
            console.error("Error verifying face:", error);
            setResult({ error: "인증 실패!" });
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">🖼️ 얼굴 인증</h2>

            {/* 이미지 업로드 */}
            <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />
            {preview && <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg mb-4" />}

            {/* 인증 버튼 */}
            <button
                onClick={handleVerify}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                얼굴 인증하기
            </button>

            {/* 결과 출력 */}
            {result && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md w-full text-center">
                    {result.error ? (
                        <p className="text-red-500">{result.error}</p>
                    ) : (
                        <p className="text-green-500 font-bold">✅ 유사도: {result?.result?.[0]?.face_matches?.[0]?.similarity?.toFixed(2)}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FaceVerification;
