import React from 'react'

const InspectionItems: React.FC = () => {
  return (
    <div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                <span className="text-teal-600 mr-1">◢</span> Inspection items
              </h2>
            </div>
            <div className="flex-1 overflow-auto px-4 pb-4">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 p-2">날짜</th>
                    <th className="border border-gray-300 p-2">검사명</th>
                    <th className="border border-gray-300 p-2">수의사</th>
                    <th className="border border-gray-300 p-2">완료</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                 
                  </tr>
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  )
}

export default InspectionItems