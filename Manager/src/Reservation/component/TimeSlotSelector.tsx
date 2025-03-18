import React from "react";

interface TimeSlotSelectorProps {
    selectedTimeSlot: 'morning' | 'afternoon'; // selectedTimeSlot의 타입 정의
    setSelectedTimeSlot: React.Dispatch<React.SetStateAction<'morning' | 'afternoon'>>; // setSelectedTimeSlot의 타입 정의
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ selectedTimeSlot, setSelectedTimeSlot }) => (
    <div className="flex items-center mb-4 space-x-2">
        <button
            onClick={() => setSelectedTimeSlot('morning')}
            className={`px-4 py-2 bg-gray-200 rounded hover:bg-teal-500 hover:text-white
        ${selectedTimeSlot === 'morning' ? 'bg-teal-500 text-white' : ''}`}
        >
            오전
        </button>
        <button
            onClick={() => setSelectedTimeSlot('afternoon')}
            className={`px-4 py-2 bg-gray-200 rounded hover:bg-teal-500 hover:text-white
        ${selectedTimeSlot === 'afternoon' ? 'bg-teal-500 text-white' : ''}`}
        >
            오후
        </button>
    </div>
);

export default TimeSlotSelector;
