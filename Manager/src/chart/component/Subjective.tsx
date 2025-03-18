import React from "react";
import { useChartStore } from "../../zustand/ChartStore.ts";

const Subjective: React.FC = () => {
  const { subjective, setSubjective } = useChartStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
        <span className="text-teal-600 mr-1">◢</span> Subjective
      </h3>
      <textarea
        className="w-full h-32 border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none text-sm"
        placeholder="내용을 입력하세요"
        value={subjective || ""}
        onChange={(e) => setSubjective(e.target.value)}
      />
    </div>
  );
};

export default Subjective;
