import React, { useState, useEffect } from "react";
import axios from "axios";

const timeSlots = {
    morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
    afternoon: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]
};

interface Reserve {
    reserveNum: number;
    petNum: number;
    reserveDate: string;
    reserveNotice: string;
    reserveTime: string;
    managerNum: number; // 의사 ID 추가
    pet: {
        petSpecies: string;
        petName: string;
        petBreed: string;
        petGender: string;
    };
}

interface ReservationGridProps {
    selectedDate: Date;
    selectedTimeSlot: 'morning' | 'afternoon';
}

const ReservationGrid: React.FC<ReservationGridProps> = ({ selectedDate, selectedTimeSlot }) => {
    const [reservationData, setReservationData] = useState<Reserve[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservationIndex, setSelectedReservationIndex] = useState<number | null>(null);
    const [doctors, setDoctors] = useState<{ managerName: string; managerNum: number }[] | null>(null);
    const slots = selectedTimeSlot === "morning" ? timeSlots.morning : timeSlots.afternoon;

    const token = sessionStorage.getItem("accessToken");

    // 의사 리스트 가져오기
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:7124/back/api/managers/doctorname');
                setDoctors(response.data);
                console.log("의사 리스트:", response.data);
            } catch (error) {
                console.error("의사 리스트 불러오기 실패:", error);
            }
        };
        fetchDoctors();
    }, []);
    // 예약 데이터 가져오기
    useEffect(() => {
        const fetchReservationData = async () => {
            const reserveDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

            try {
                const response = await axios.get(`http://localhost:7124/back/api/reserve/all/1?reserveDate=${reserveDate}`);
                setReservationData(response.data);
                console.log(response.data, "예약 데이터");
            } catch (error) {
                console.error("예약 데이터 불러오기 실패:", error);
            }
        };

        fetchReservationData();
    }, [selectedDate]);

    // 예약 클릭 시 모달 열기
    const onReservationClick = (reserveNum: number) => {
        const reservation = reservationData.find(res => res.reserveNum === reserveNum);
        if (reservation) {
            setSelectedReservationIndex(reservationData.indexOf(reservation));
            setIsModalOpen(true);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
            <thead>
    <tr className="bg-gray-200">
        <th className="border border-gray-300 p-2">시간</th>
        {doctors ? (
            doctors.map((doctor) => (
                <th key={doctor.managerNum} className="border border-gray-300 p-2">
                    {doctor.managerName}
                </th>
            ))
        ) : (
            <th className="border border-gray-300 p-2">의사 정보 없음</th>
        )}
    </tr>
</thead>
                <tbody>
                    {slots.map((time) => (
                        <tr key={time} className="text-center">
                            <td className="border border-gray-300 p-2 font-semibold">{time}</td>
                            {doctors ? (
    doctors.map((doctor) => {
        // 해당 시간 + 의사에게 예약된 데이터 찾기
        const reservation = reservationData.find(
            (res) => res.reserveTime === time && res.managerNum === doctor.managerNum
        );

        return (
            <td
                key={`${doctor.managerNum}-${time}`}
                className={`border border-gray-300 p-2 cursor-pointer ${
                    reservation ? "bg-teal-50 hover:bg-teal-100" : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => reservation && onReservationClick(reservation.reserveNum)}
            >
                {reservation ? (
                    <div className="text-sm text-gray-700">
                        <p>{reservation.pet.petName} ({reservation.pet.petSpecies})</p>
                        <p className="text-xs text-gray-500">{reservation.reserveNotice}</p>
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs">-</span>
                )}
            </td>
        );
    })
) : (
    <td className="border border-gray-300 p-2 text-gray-400" colSpan={doctors?.length || 1}>
        의사 정보를 불러오는 중...
    </td>
)}

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationGrid;
