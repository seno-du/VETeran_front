import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaUserMd,
    FaHospital,
    FaPaw,
    FaEye,
    FaDog,
    FaCat,
    FaStethoscope,
    FaBriefcaseMedical
} from "react-icons/fa"; // 🐾 펫 아이콘 추가

import ReservationIng from "./components/ReservationIng";
import Componation from "./components/Componation";


const ReservationCompleted: React.FC = () => {
    // console.log("✅ ReservationCompleted 컴포넌트가 렌더링됨!");
    const navigate = useNavigate();
    const location = useLocation();

    const departmentMap: { [key: string]: string } = {
        "4": "안과",
        "5": "내과",
        "6": "외과"
    };

    // 📌 state가 없을 경우 기본값을 설정하여 오류 방지
    const { department, doctor, time, pet, note } = location.state || {};

    // ✅ selectedDepartment가 숫자로 올 경우 한글 이름으로 변환
    const departmentName = departmentMap[department] || department;

    useEffect(() => {
        console.log("마지막이다마지막이다마지막이다마지막이다마지막이다")
        console.log("departmen", department, "doctor", doctor, "time", time, "pet", pet, "note", note)
    }, [department, departmentName, doctor, time, pet, note]);


    return (
        <div className="max-w-6xl mx-auto py-10 px-5 bg-white mb-20">

            <div className="max-w-6xl mx-auto py-10 px-5 bg-white">
                <ReservationIng check={true} />

                {/* 예약 정보 */}
                <div className="grid grid-cols-4 gap-6 mb-16 overflow-x-auto">
                    {/* 진료과 선택 확인 */}
                    <div className="bg-green-600 text-white p-6 rounded-lg shadow-md text-center">
                        <FaHospital className="text-4xl mx-auto mb-2" />
                        <h3 className="text-xl font-bold">진료과</h3>

                        {/* 진료과에 따른 아이콘 선택 */}
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mt-2">
                            {department === "안과" && <FaEye className="text-green-600 text-4xl" />}
                            {department === "내과" && <FaStethoscope className="text-green-600 text-4xl" />}
                            {department === "외과" && <FaBriefcaseMedical className="text-green-600 text-4xl" />}
                        </div>

                        {/* 진료과명 */}
                        <p className="mt-2 text-lg font-bold">{department}</p>
                    </div>

                    {/* 의료진 선택 확인 */}
                    <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md text-center">
                        <FaUserMd className="text-4xl mx-auto mb-2" />
                        <h3 className="text-xl font-bold">의료진</h3>
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-24 h-24 mx-auto rounded-full object-cover mt-2 border-2 border-white"
                        />
                        <p className="mt-2 text-lg font-bold">{doctor.name}</p>
                        <p className="mt-1 text-sm font-medium">{doctor.specialty}</p>
                    </div>

                    {/* 진료일/시간 선택 확인 */}
                    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
                        <FaCalendarAlt className="text-4xl mx-auto mb-2" />
                        <h3 className="text-xl font-bold">진료일/시간</h3>

                        {/* 시간 */}
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex flex-col items-center justify-center mt-2">
                            <p className="text-blue-600 text-lg font-bold leading-tight">
                                {parseInt(time.selectedTime) < 12 ? "오전" : "오후"}
                            </p>
                            <p className="text-blue-600 text-lg font-bold leading-tight">
                                {time.selectedTime >= 12 && (time.selectedTime = time.selectedTime - 12)}
                                {time.selectedTime}
                            </p>
                        </div>


                        {/* 날짜 */}
                        <p className="text-lg font-semibold mt-2">{time.selectedDate}</p>
                    </div>

                    {/* 🐾 펫 선택 확인 */}
                    <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md text-center">
                        <FaPaw className="text-4xl mx-auto mb-2" />
                        <h3 className="text-xl font-bold">나의 펫</h3>

                        {/* 펫 아이콘 */}
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mt-2">
                            {pet.petSpecies === "강아지" ? (
                                <FaDog className="text-purple-600 text-4xl" />
                            ) : pet.petSpecies === "고양이" ? (
                                <FaCat className="text-purple-600 text-4xl" />
                            ) : (
                                <FaPaw className="text-purple-600 text-4xl" />
                            )}
                        </div>

                        {/* 펫 이름 */}
                        <p className="mt-2 text-lg font-bold">{pet.petName}</p>
                    </div>
                </div>

                <Componation check={true} />
            </div>


        </div>
    );
};

export default ReservationCompleted;
