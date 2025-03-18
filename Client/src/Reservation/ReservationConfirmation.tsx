import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserMd, FaClock, FaHospital, FaPaw, FaEye, FaDog, FaCat, FaStethoscope, FaBriefcaseMedical } from "react-icons/fa"; // 🐾 펫 아이콘 추가
import TossPay from "../tosspay/TossPay";
import ReservationIng from "./components/ReservationIng";
import Componation from "./components/Componation";

const ReservationConfirmation: React.FC = () => {
    // console.log("✅ ReservationConfirmation 컴포넌트가 렌더링됨!");
    const navigate = useNavigate();
    const location = useLocation();
    const [doctors, setDoctors] = useState<{ doctor: [managerNum: number, managerName: string]; name: string; department: string; specialty: string; note: string; image: string }[]>([]);

    // 📌 state가 없을 경우 기본값을 설정하여 오류 방지
    const { department, time, pet, note, doctor } = location.state || {};
    console.log("콘솔!!!!!!", department, time, pet, note, doctor);

    useEffect(() => {
        console.log("받아오는 값 확인:", location.state);
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-10 px-5 bg-white mb-20">
            {/* 상단 제목 */}
            <h1 className="text-3xl font-bold text-left mb-4">인터넷 진료예약 확인</h1>
            <div className="w-full bg-gray-200 h-0.5 mb-10"></div>

            <ReservationIng check={false} />

            {/* 진행 단계 표시 */}
            <div className="flex justify-center items-center mb-16">
                {[
                    { name: "진료과 선택", icon: <FaHospital />, path: "/department_selection" },
                    { name: "의료진 선택", icon: <FaUserMd />, path: "/select_doctor" },
                    { name: "나의 펫 선택", icon: <FaPaw />, path: "/animal_selection" },
                    { name: "진료일/시 선택", icon: <FaCalendarAlt />, path: "/select_datetime" },
                    { name: "진료예약 확인", icon: <FaClock />, path: "/confirm_reservation", active: true },
                ].map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => navigate(step.path)}
                        >
                            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${step.active ? "bg-green-500 text-white" : "bg-gray-300 text-white"}`}>
                                {step.icon}
                            </div>
                            <p className={`mt-2 ${step.active ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                                {step.name}
                            </p>
                        </div>
                        {index !== 4 && <div className="w-16 h-0.5 bg-gray-300 relative -top-3"></div>}
                    </React.Fragment>
                ))}
            </div>

            {/* 예약 확인 내용 */}
            <div className="grid grid-cols-4 gap-6">
                {/* 진료과 선택 확인 */}
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-md text-center">
                    <FaHospital className="text-4xl mx-auto mb-2" />
                    <h3 className="text-xl font-bold">진료과</h3>

                    {/* 진료과에 따른 아이콘 선택 */}
                    <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mt-2">
                        {
                            doctor && (
                                <>
                                    {doctor.department === "안과" && <FaEye className="text-green-600 text-4xl" />}
                                    {doctor.department === "내과" && <FaStethoscope className="text-green-600 text-4xl" />}
                                    {doctor.department === "외과" && <FaBriefcaseMedical className="text-green-600 text-4xl" />}
                                </>
                            )
                        }
                    </div>

                    {/* 진료과명 (아이콘 아래 배치) */}
                    <p className="mt-2 text-lg font-bold">{doctor.department}</p>

                    <button
                        className="mt-4 bg-white text-green-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                        onClick={() => navigate("/department_selection")}
                    >
                        다시 선택
                    </button>
                </div>

                {/* 의료진 선택 확인 */}
                <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md text-center">
                    <FaUserMd className="text-4xl mx-auto mb-2" />
                    <h3 className="text-xl font-bold">의료진</h3>
                    <img
                        src={doctor.image}
                        alt={doctor.doctor.managerName}
                        className="w-24 h-24 mx-auto rounded-full object-cover mt-2 border-2 border-white"
                    />
                    <p className="mt-2 text-lg font-bold">{doctor.doctor.managerName}</p>
                    <button
                        className="mt-4 bg-white text-teal-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                        onClick={() => navigate("/select_doctor", { state: { department, time, pet, note, doctor } })}
                    >
                        다시 선택
                    </button>
                </div>


                {/* 진료일/시간 선택 확인 */}
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
                    <FaCalendarAlt className="text-4xl mx-auto mb-2" />
                    <h3 className="text-xl font-bold">진료일/시간</h3>


                    {/* 시간 (오전/오후 + hh:mm) */}
                    <div className="w-24 h-24 mx-auto bg-white rounded-full flex flex-col items-center justify-center mt-2">
                        <p className="text-blue-600 text-lg font-bold leading-tight">
                            {/* 오전/오후 표시 */}
                            {parseInt(time.selectedTime) < 12 ? "오전" : "오후"}
                        </p>
                        <p className="text-blue-600 text-lg font-bold leading-tight">
                            {/* 시간 출력 */}
                            {time.selectedTime}
                        </p>
                    </div>

                    {/* 날짜 (연-월-일)*/}
                    <p className="text-lg font-semibold mt-2">
                        {time.selectedDate} {/* 날짜만 */}
                    </p>

                    <button
                        className="mt-4 bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                        onClick={() => navigate("/select_datetime", { state: { time, pet, note, doctor } })}
                    >
                        다시 선택
                    </button>
                </div>



                {/* 🐾 펫 선택 확인 */}
                <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md text-center">
                    <FaPaw className="text-4xl mx-auto mb-2" />
                    <h3 className="text-xl font-bold">나의 펫</h3>

                    {/* 펫 아이콘을 원 안에 배치 */}
                    <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mt-2">
                        {pet.petSpecies === "강아지" ? (
                            <FaDog className="text-purple-600 text-4xl" />
                        ) : pet.petSpecies === "고양이" ? (
                            <FaCat className="text-purple-600 text-4xl" />
                        ) : (
                            <FaPaw className="text-purple-600 text-4xl" />
                        )}
                    </div>

                    {/* 펫 이름을 원 아래로 이동 */}
                    <p className="mt-2 text-lg font-bold">{pet.petName}</p>

                    <button
                        className="mt-4 bg-white text-purple-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                        onClick={() => navigate("/animal_selection", { state: { time, pet, note, doctor } })}
                    >
                        다시 선택
                    </button>
                </div>
            </div>

            {/* 하단 예약 정보 확인 */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-bold mb-4">예약자 정보 확인</h3>

                <Componation check={false} />

                {/* 결제 진행 버튼 중앙 정렬 및 간격 조정 */}
                <div className="flex justify-center mt-8">
                    <TossPay
                        time={time}
                        pet={pet}
                        note={note}
                        doctor={doctor}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReservationConfirmation;
