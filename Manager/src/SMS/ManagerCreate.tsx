import React, { useState } from 'react';
import axios from 'axios';
import DaumPostcode from "react-daum-postcode";
import { FaCalendarAlt, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

const ManagerCreate: React.FC = () => {

    const token = sessionStorage.getItem("accessToken");

    const [form, setForm] = useState({
        managerName: "",
        managerLicenseNum: "",
        managerPhone: "",
        managerEmail: "",
        managerBirth: "",
        managerGender: "",
        managerAddress: "",
        managerImage: null,
        permissionRole: "테크니션",
        role: "0",  // 역할 추가
    });
    const [error, setError] = useState("");
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState("");



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setForm({ ...form, managerImage: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddressSelect = (data: any) => {
        setForm({ ...form, managerAddress: data.address });
        setIsAddressOpen(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // 숫자만 남기기
        value = value.replace(/\D/g, '');

        // 3자리마다 "-" 추가
        if (value.length > 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d{0,})/, '$1-$2');
        } else if (value.length > 7 && value.length <= 10) {
            value = value.replace(/(\d{3})(\d{4})(\d{0,})/, '$1-$2-$3');
        } else if (value.length > 10) {
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }

        // 최대 길이 13자로 제한 (형식상 000-0000-0000은 13자)
        if (value.length > 13) {
            value = value.substring(0, 13);
        }

        // 상태 업데이트
        setForm({
            ...form,
            managerPhone: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        if (form.managerName.trim().length === 0) {
            alert("이름을 입력해주세요");
            return;
        }

        if (form.managerLicenseNum.trim().length !== 5) {
            alert("면허번호는 5자리여야 합니다.");
            return;
        }

        if (form.managerPhone.trim().length === 0) {
            alert("휴대폰번호 11자리를 입력해주세요");
            return;
        }

        if (form.managerEmail.trim().length === 0) {
            alert("이메일을 입력해주세요.");
            return;
        }

        if (form.managerBirth === null) {
            alert("생일을 선택해주세요.")
            return;
        }

        if (form.managerGender === null) {
            alert("성별을 선택해주세요.")
            return;
        }

        if (form.managerAddress === null) {
            alert("주소를 입력해주세요.")
            return;
        }

        const formData = new FormData();

        // formData에 form 상태에서 값을 추가합니다.
        Object.keys(form).forEach((key) => {
            // form[key] 값이 존재할 경우에만 FormData에 추가
            if (form[key]) {
                // 만약 해당 값이 파일이라면 (파일 입력을 위한 경우)
                if (form[key] instanceof File) {
                    formData.append(key, form[key]);
                } else {
                    // 파일이 아닌 경우, 그냥 일반 값으로 append
                    formData.append(key, form[key]);
                }
            }
        });


        try {
            // Send the POST request with the FormData
            const response = await axios.post(`http://localhost:7124/back/api/managers/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,  // 토큰이 잘 불러와졌는지 확인
                    'Content-Type': 'multipart/form-data',  // 파일 전송을 위한 Content-Type
                },
            });

            if (response.status === 200) {
                const { managerEmail, managerPwd } = response.data;

                alert("회원 등록이 완료되었습니다.");
                alert(`이메일: ${managerEmail} / 비밀번호: ${managerPwd}`);
                window.location.reload();
            } else {
                setError("회원가입에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error(error);  // 서버에서 오류가 발생한 경우 콘솔 로그
            setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg w-[450px]">
                <h2 className="text-2xl font-semibold text-center text-gray-800">병원 관계자 회원가입</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <FaUser className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            name="managerName"
                            placeholder="이름"
                            value={form.managerName}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-300"
                        />
                    </div>

                    <select
                        name="permissionRole"
                        value={form.permissionRole}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    >
                        <option value="테크니션">테크니션</option>
                        <option value="수의사">수의사</option>
                        <option value="매니저">매니저</option>
                    </select>

                    {form.permissionRole === '테크니션' && (
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        >
                            <option value="0">테크니션</option>
                        </select>
                    )}

                    {form.permissionRole === '수의사' && (
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        >
                            <option value="4">안과</option>
                            <option value="5">내과</option>
                            <option value="6">외과</option>
                            <option value="7">마취과</option>
                            <option value="8">영상검사과</option>
                        </select>
                    )}

                    {form.permissionRole === '매니저' && (
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        >
                            <option value="98">재고관리자</option>
                            <option value="99">부관리자</option>
                        </select>
                    )}

                    <div className="relative mb-4">
                        <FaUser className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            name="managerLicenseNum"
                            placeholder="수의사 면허 번호"
                            value={form.managerLicenseNum}
                            onChange={handleChange}
                            maxLength={5}
                            className="w-full pl-10 p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-300"
                        />
                    </div>

                    <div className="relative mb-4">
                        <FaPhone className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            name="managerPhone"
                            placeholder="전화번호"
                            value={form.managerPhone}
                            onChange={handlePhoneChange}
                            className="w-full pl-10 p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-300"
                        />
                    </div>

                    <div className="relative mb-4">
                        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            name="managerEmail"
                            placeholder="이메일"
                            value={form.managerEmail}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-300"
                        />
                    </div>

                    <div className="relative mb-4">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="date"
                            name="managerBirth"
                            value={form.managerBirth}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-300"
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center">
                            <input type="radio" name="managerGender" value="여성" checked={form.managerGender === "여성"} onChange={handleChange} className="mr-2" />
                            여성
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="managerGender" value="남성" checked={form.managerGender === "남성"} onChange={handleChange} className="mr-2" />
                            남성
                        </label>
                    </div>

                    <div className="mb-2 flex">
                        <input
                            type="text"
                            name="managerAddress"
                            placeholder="주소"
                            value={form.managerAddress}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setIsAddressOpen(true)}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            주소 검색
                        </button>
                    </div>

                    {isAddressOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded shadow-lg">
                                <DaumPostcode onComplete={handleAddressSelect} />
                                <button
                                    type="button"
                                    onClick={() => setIsAddressOpen(false)}
                                    className="mt-4 w-full bg-red-500 text-white"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <div>사진 등록</div>
                        <input
                            type="file"
                            name="managerImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 mb-2 border border-gray-300 rounded"
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover mt-2" />}
                    </div>

                    <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded">
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManagerCreate;
