import React from "react";
import { useNavigate } from "react-router-dom";
import ReservationIng from "./components/ReservationIng";

const DepartmentSelection: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div className="max-w-6xl mx-auto py-10 px-5 bg-white">
      {/* 상단 제목 */}
      <h1 className="text-3xl font-bold text-left mb-4">인터넷 진료예약 확인</h1>
      <div className="w-full bg-gray-200 h-0.5 mb-10"></div>

      <ReservationIng check={false} />

      {/* 진행 단계 표시 */}
      <div className="flex justify-center items-center mb-10">
        {[
          { name: "진료과 선택", icon: "✓", path: "/department_selection", active: true, disabled: false },
          { name: "의료진 선택", icon: "👨‍⚕️", path: "/select_doctor", disabled: true },
          { name: "나의 펫 선택", icon: "🐾", path: "/animal_selection", disabled: true },
          { name: "진료일/시 선택", icon: "⏰", path: "/select_datetime", disabled: true },
          { name: "진료예약 확인", icon: "📝", path: "/reservation_confirmation", disabled: true }
        ].map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => !step.disabled && navigate(step.path)}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${step.active ? "bg-green-500 text-white" : "bg-gray-300 text-white"}`}>
                {step.icon}
              </div>
              <p className={`mt-2 ${step.active ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
            {index < 4 && <div className="w-16 h-0.5 bg-gray-300 relative -top-3"></div>}
          </React.Fragment>
        ))}
      </div>


      {/* 진료과 선택 UI (3개로 수정) */}
      <div className="grid grid-cols-3 gap-6 bg-gray-100 p-10 rounded-lg mb-10">
        {[
          { name: "안과", icon: "👁️", value: "4" },
          { name: "내과", icon: "💉", value: "5" },
          { name: "외과", icon: "🦵", value: "6" },
        ].map((dept, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md 
                       hover:shadow-lg transition border-2 border-transparent 
                       hover:border-green-500 cursor-pointer hover:bg-green-100"
            onClick={() => navigate("/select_doctor", { state: { department: dept.value } })}
          >
            <div className="text-4xl">{dept.icon}</div>
            <p className="mt-3 text-lg font-semibold text-gray-700">{dept.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSelection;
