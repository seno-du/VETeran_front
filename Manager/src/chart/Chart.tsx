import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import VitalsChart from "./component/VitalsChart.tsx";
import PatientInfo from "./component/PatientInfo.tsx";
import Subjective from "./component/Subjective.tsx";
import Objective from "./component/Objective.tsx";
import Assessment from "./component/Assessment.tsx";
import Followup from "./component/Followup.tsx";
import History from "./component/History.tsx";
import Plan from "./component/Plan.tsx";
import FooterSave from "../footer/FooterSave.tsx";
import { useChartHistoryStore, useChartStore } from "../zustand/ChartStore.ts";
import axios from "axios";

const SERVER_URL = "http://localhost:7124/back";

const Chart: React.FC = () => {
  const location = useLocation();
  // 전달받은 pet 데이터를 state에서 추출 (선택된 환자가 없으면 null 처리)
  const chartStore = useChartStore();
  const chartNum = useParams<{ chartNum: string }>().chartNum;
  const { setHistory, setSelectedHistory } = useChartHistoryStore();

  useEffect(() => {
    setSelectedHistory(null);
  }, []);

  const getPetData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/chart/${chartNum}`);
      console.log(response);
      const currentChart = response.data.currentChart;
      const chartHistory = response.data.chartHistory;
      console.log(chartHistory);
      setHistory(chartHistory);
      chartStore.setPetNum(currentChart.petNum);
      chartStore.setUserName(currentChart.userName);
      chartStore.setPetSpecies(currentChart.petSpecies);
      chartStore.setPetColor(currentChart.petColor);
      chartStore.setPetName(currentChart.petName);
      chartStore.setPetBreed(currentChart.petBreed);
      chartStore.setPetGender(currentChart.petGender);
      chartStore.setPetBirth(currentChart.petBirth);
      chartStore.setPetMicrochip(currentChart.petMicrochip);
      chartStore.setPetWeight(currentChart.petWeight);
      chartStore.setPetStatus(currentChart.petStatus);
      chartStore.setPetImage(currentChart.petImage);
      chartStore.setSubjective(currentChart.subjective);
      chartStore.setAssessment(currentChart.assessment);

      console.log("******************API로부터 받아온 hospitalNum:", currentChart.hospitalNum);
      chartStore.setHospitalNum(currentChart.hospitalNum ?? 0);
      console.log("******************없으면 0으로 반환 hospitalNum:", currentChart.hospitalNum);
    } catch (error) {
      console.log(error);
      alert("서버에서 데이터를 불러오는데 실패했습니다");
    }
  };

  useEffect(() => {
    getPetData();
    if (chartNum) {
      chartStore.setChartNum(chartNum as unknown as number);
    }
  }, []);

  return (
    // relative를 추가하여 자식의 fixed 포지션이 해당 컨테이너 기준이 되도록 함.
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <div className="flex-grow p-4 pb-24 h-max">
        {/* 실제 pet 데이터를 PatientInfo 컴포넌트에 전달 */}
        <PatientInfo />

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-4 min-h-[600px]">
          {/* Left Section */}
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Subjective />
              <Objective />
            </div>
            <Assessment />
            <Plan />
          </div>

          {/* Right Section */}
          <div className="flex flex-col flex-1 space-y-4">
            <Followup />
            <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                <span className="mr-1 text-teal-600">◢</span> Patient Vitals
              </h3>
              <VitalsChart />
            </div>
            <div className="flex-1">
              <History />
            </div>
          </div>
        </div>
      </div>
      {/* Footer를 fixed 속성으로 하단에 고정 */}
      <div className="fixed bottom-0 left-0 right-0">
        <FooterSave />
      </div>
    </div>
  );
};

export default Chart;
