import React from 'react'

const EquipmentMaintenance: React.FC = () => {

    const equipmentData = [
        { name: "IDEXX ProCyte Dx", status: "Operational", frequency: 120, expiry: "2025-06-30" },
        { name: "IDEXX Catalyst One", status: "Maintenance Required", frequency: 75, expiry: "2024-12-15" },
        { name: "Abaxis VetScan VS2", status: "Operational", frequency: 150, expiry: "2025-08-20" },
        { name: "Heska Element HT5", status: "Check Soon", frequency: 80, expiry: "2024-10-10" },
        { name: "Mindray BC-30 Vet", status: "Operational", frequency: 110, expiry: "2025-05-05" },
        { name: "Sysmex pocH-100iV", status: "Maintenance Required", frequency: 50, expiry: "2024-11-25" },
      ];
  return (
    <div>
      
            <div className="p-4">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                <span className="text-teal-600 mr-1">◢</span> Equipment Maintenance
              </h2>
              <div className="space-y-4">
                {equipmentData.map((equipment, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3 text-gray-700 font-medium">{equipment.name}</div>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-300 ${
                          (equipment.frequency / 200) * 100 < 50 ? "bg-rose-400" :
                          equipment.status === "Operational" ? "bg-teal-500" :
                          "bg-teal-500"
                        }`}
                        style={{ width: `${(equipment.frequency / 200) * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-5 w-14 text-gray-600 font-semibold">
                      {equipment.frequency}회
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
  )
}

export default EquipmentMaintenance