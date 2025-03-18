import PlanTable from "./PlanTable.tsx";
import React, { useEffect, useCallback } from "react";
import { useInventoryStore } from "../../zustand/InventoryStore.ts";
import axios from "axios";
import { useParams } from "react-router-dom";

const SERVER_URL = "http://localhost:7124/back/api";

const Plan: React.FC = () => {
    const { setPlanItems } = useInventoryStore();
    const { chartNum } = useParams(); // URL에서 chartNum 가져오기

    // Plan 데이터를 가져오는 함수
    const fetchPlanItems = useCallback(async () => {
        if (!chartNum) {
            console.warn("⛔ chartNum이 없습니다. Plan 데이터를 불러올 수 없습니다.");
            return;
        }
    
        try {
            const response = await axios.get(`${SERVER_URL}/itemhistory/chart/${chartNum}`);
    
            if (!response?.data || !Array.isArray(response.data)) {
                throw new Error("❌ 응답 데이터가 유효하지 않습니다.");
            }
            setPlanItems(response.data);
        } catch (error) {
            console.error("❌ Plan 데이터 불러오기 실패:", error);
            setPlanItems([]); // 오류 발생 시 빈 배열로 설정하여 UI 오류 방지
        }
    }, [chartNum, setPlanItems]);
    

    // 컴포넌트가 마운트될 때 Plan 데이터 로드
    useEffect(() => {
        fetchPlanItems();
    }, [fetchPlanItems]);

    return (
        <div className="bg-white h-[500px] p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                <span className="text-teal-600 mr-1">◢</span> Plan
            </h3>
            <div className="flex-grow relative">
                <PlanTable buttonSize="small" />
            </div>
        </div>
    );
};

export default Plan;
