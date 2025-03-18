import React from "react";

const TestItemEntry: React.FC = () => {
  const items = [

  ];
  return (
    <div className="flex-1 bg-white shadow rounded-md flex flex-col">
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700">
        <span className="text-teal-600 mr-1">◢</span> Enter the test
        item results
      </h3>
    </div>
    <div className="flex-1 overflow-auto px-4 pb-4">
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="border border-gray-300 p-2">검사항목명</th>
            <th className="border border-gray-300 p-2">결과</th>
            <th className="border border-gray-300 p-2">Min</th>
            <th className="border border-gray-300 p-2">Max</th>
            <th className="border border-gray-300 p-2">단위</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  </div>
  );
};

export default TestItemEntry;
