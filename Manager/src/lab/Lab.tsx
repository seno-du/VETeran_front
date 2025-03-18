import React, { useState } from "react";
import InspectionItems from "./component/InspectionItems";
import EquipmentMaintenance from "./component/EquipmentMaintenance";
import TestItemEntry from "./component/TestItemEntry";
import InspectionReport from "./component/InspectionReport";
import FooterSave from "../footer/FooterSave";

const Lab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("검사대기");
  const [selectedDate, setSelectedDate] = useState("2023-06-20 ~ 2023-06-20");

  const items = [
    "RBC (procyte)",
    "HCT (procyte)",
    "HGB",
    "MCV (procyte)",
    "MCH (procyte)",
    "MCHC (procyte)",
    "RDW (procyte)",
    "%RETIC",
    "Reticulocyte count",
    "RETIC-HGB",
    "WBC (procyte)",
  ];
  const dummyData = items.map(() => Math.random() * (15 - 5) + 5);

  return (
    <div className="h-screen bg-gray-100 text-gray-800 p-2">
      <div className="flex flex-col h-full gap-4">
        {/* Top section */}
        <div className="flex gap-4 h-2/5">
          {/* Left panel */}
          <div className="w-1/4 bg-white shadow rounded-md flex flex-col">
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-lg font-semibold">
                  <span className="text-teal-600 mr-1">◢</span> Patient List
                </h2>
                <button
                  className={`px-4 py-1.5 bg-teal-00 text-white rounded hover:bg-teal-700 transition-colors text-sm ${
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
                    setSelectedDate(
                      e.target.value + " ~ " + selectedDate.split(" ~ ")[1]
                    )
                  }
                  className="px-4 py-1.5 border border-gray-300 rounded focus:outline-none text-center font-bold text-sm w-full"
                />
                <input
                  type="date"
                  value={selectedDate.split(" ~ ")[1]}
                  onChange={(e) =>
                    setSelectedDate(
                      selectedDate.split(" ~ ")[0] + " ~ " + e.target.value
                    )
                  }
                  className="px-4 py-1.5 border border-gray-300 rounded focus:outline-none text-center font-bold text-sm w-full"
                />
                <button className="px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm w-full">
                  새로고침
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto px-4 pb-4">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 p-2">환자</th>
                    <th className="border border-gray-300 p-2">보호자</th>
                    <th className="border border-gray-300 p-2">품종</th>
                    <th className="border border-gray-300 p-2">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "검사대기"
                    ? [...Array(10)].map((_, index) => (
                        <tr key={index} className="border-b border-gray-300">

                        </tr>
                      ))
                    : [...Array(10)].map((_, index) => (
                        <tr key={index} className="border-b border-gray-300">

                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle panel */}
          <div className="flex-1 bg-white shadow rounded-md flex flex-col">
            <InspectionItems/>
          </div>

          {/* Right panel */}
          <div className="w-1/3 bg-white shadow rounded-md flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                <span className="text-teal-600 mr-1">◢</span> Test Results Graph
              </h2>
            </div>
            <div className="flex-1 overflow-auto px-4 pb-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3 text-gray-700 font-medium">
                      {item}
                    </div>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-teal-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${(dummyData[index] / 20) * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-gray-600 font-semibold">
                      {dummyData[index].toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex gap-4 h-[50%]">
          {/* Left panel */}
          <InspectionReport/>

          {/* Middle panel */}
          <TestItemEntry/>

          {/* Right panel */}
          <div className="w-1/3 bg-white shadow rounded-md flex flex-col">
            <EquipmentMaintenance/>
        </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white">
          <FooterSave />
        </div>
      </div>
    </div>
  );
};

export default Lab;
