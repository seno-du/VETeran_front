import React from "react";

interface PatientListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="w-full bg-white shadow rounded-md flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-lg font-semibold">
            <span className="text-teal-600 mr-1">◢</span> Patient List
          </h2>
          <button
            className={`px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm ${
              activeTab === "검사대기" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("검사대기")}
          >
            검사대기
          </button>
          <button
            className={`px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm ${
              activeTab === "검사완료" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("검사완료")}
          >
            검사완료
          </button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="date"
            value={selectedDate.split(" ~ ")[0]}
            onChange={(e) =>
              setSelectedDate(e.target.value + " ~ " + selectedDate.split(" ~ ")[1])
            }
            className="px-4 py-1.5 border border-gray-300 rounded focus:outline-none text-center font-bold text-sm w-full"
          />
          <input
            type="date"
            value={selectedDate.split(" ~ ")[1]}
            onChange={(e) =>
              setSelectedDate(selectedDate.split(" ~ ")[0] + " ~ " + e.target.value)
            }
            className="px-4 py-1.5 border border-gray-300 rounded focus:outline-none text-center font-bold text-sm w-full"
          />
          <button className="px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm w-full">
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
