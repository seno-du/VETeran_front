import React from "react";

const InspectionReport: React.FC = () => {
  return (
    <div className="w-1/4 bg-white shadow rounded-md flex flex-col">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700">
          <span className="text-teal-600 mr-1">◢</span> Inspection report
        </h3>
      </div>
      <div className="flex-1 px-4 pb-4">
        <textarea className="w-full h-full border rounded p-2 resize-none text-sm" placeholder="내용을 입력하세요" />
      </div>
    </div>
  );
};

export default InspectionReport;
