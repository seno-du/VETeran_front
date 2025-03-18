import React from "react";

interface TestResultsGraphProps {
  items: string[];
  dummyData: number[];
}

const TestResultsGraph: React.FC<TestResultsGraphProps> = ({ items, dummyData }) => {
  return (
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
  );
};

export default TestResultsGraph;
