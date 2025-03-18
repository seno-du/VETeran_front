import React, { useEffect } from "react";
import { useChartStore } from "../zustand/ChartStore.ts";
import axios from "axios";
import { useItemHistoryStore } from "../zustand/ItemStore.ts";
import { useChartLogStore } from "../zustand/ChartLogStore.ts";

const SERVER_URL = "http://localhost:7124/back";

const FooterSave: React.FC = () => {
  const navItems = [
    { icon: "💾", text: "진료 저장", id: "save" }
  ];

  const chartStore = useChartStore();

  //  hospitalStatus 상태 구독
  const hospitalStatus = useChartStore((state) => state.hospitalStatus);
  const setHospitalStatus = useChartStore((state) => state.setHospitalStatus);
  const items = useItemHistoryStore((state) => state.items);
  const chartlog = useChartLogStore((state) => state.planItems);

  const hospitalNum = useChartStore((state) => state.hospitalNum);
  const setHospitalNum = useChartStore((state) => state.setHospitalNum);
  console.log("save******************************************************************************************", hospitalNum);

  //  저장 기능
  const save = async () => {
    const json_body = {
      chartNum: chartStore.chartNum,
      subjective: chartStore.subjective,
      assessment: chartStore.assessment,
      petSpecies: chartStore.petSpecies,
      petColor: chartStore.petColor,
      petName: chartStore.petName,
      petBreed: chartStore.petBreed,
      petGender: chartStore.petGender,
      petBirth: chartStore.petBirth,
      petMicrochip: chartStore.petMicrochip,
      petWeight: chartStore.petWeight,
      petStatus: chartStore.petStatus,
      userName: chartStore.userName,
      planItems: chartStore.planItems,
    };
    console.log("저장할 chartNum:", json_body.chartNum);

    try {
      console.log(json_body);

      const response = await axios.post(`${SERVER_URL}/api/chart`, json_body);

      if (items.length > 0) {
        const response1 = await axios.post(`http://localhost:7124/back/api/itemhistory/insert`, [
          {
            "itemId": "ANTI_INFLAMMATORY",
            "locationId": 1,
            "historyQuantity": 2,
            "transactionType": "출고"
          },
          {
            "itemId": "CHOLESTEROL_MED",
            "locationId": 1,
            "historyQuantity": 3,
            "transactionType": "출고"
          }
        ]);
        console.log("item저장성공")

        await axios.post(`http://localhost:7124/back/api/chartlog/insert`, [
          {
            "chartNum": chartStore.chartNum,
            "historyNum": 56
          },
          {
            "chartNum": chartStore.chartNum,
            "historyNum": 57
          }
        ]);
      }

      if (response.status === 200) {
        alert("저장에 성공하였습니다.");
      }


    } catch (error) {
      console.error(" 저장 오류:", error);
      alert("저장 도중 오류가 발생했습니다.");
    }
  };

  //  hospitalStatus 변경될 때마다 UI 업데이트 (퇴원 후 반영)
  useEffect(() => {
    console.log(" hospitalStatus 변경됨:", hospitalStatus);
  }, [hospitalStatus]); // hospitalStatus 변경 시 실행됨

  //  퇴원 처리 기능
  const discharge = async () => {
    const hospitalNum = useChartStore.getState().hospitalNum;
    if (!hospitalNum) {
      alert("퇴원 처리할 환자 정보가 없습니다.");
      return;
    }
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/hospital/discharge/${hospitalNum}`
      );

      if (response.status === 200) {
        console.log(" 응답 데이터:", response.data);
        console.log(" 이전 hospitalStatus:", hospitalStatus);

        // 상태 변경 (퇴원 처리)
        setHospitalStatus("퇴원");

        console.log(
          " 업데이트 후 hospitalStatus:",
          useChartStore.getState().hospitalStatus
        );

        alert("퇴원 처리가 되었습니다.");
      }
    } catch (error) {
      console.error("퇴원 처리 오류:", error);
      alert("퇴원 처리 도중 오류가 발생했습니다.");
    }
  };

  //  버튼 클릭 이벤트 핸들러
  const handleClick = (id: string) => {
    if (id === "save") {
      save();
    } else if (id === "discharge") {
      discharge();
    }
  };

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200">
      <div className="grid grid-cols-6 gap-4">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs text-gray-600">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterSave;
