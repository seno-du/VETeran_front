import { useEffect, useState } from "react";
import axios from "axios";

interface Vaccine {
    vaccineNum: number;
    vaccineDate: Date;
    managerNum: number;
    petNum: number;
    itemId: string;
}

interface PageDTO {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

const Vaccine = () => {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [vaccineNum, setVaccineNum] = useState("");
    const [petNum, setPetNum] = useState("");
    const [itemId, setItemId] = useState("");
    const [pageInfo, setPageInfo] = useState<PageDTO | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);



    const fetchVaccines = async (page: number) => {
        try {
            const response = await axios.get(`http://localhost:7124/back/api/vaccine/all?page=${page}`);
            setVaccines(response.data.list || []);
            setPageInfo(response.data.PageDTO);
        } catch (error) {
            console.error("백신 목록 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchVaccines(currentPage);
    }, [currentPage]);

    const searchVaccine = async () => {
        if (!vaccineNum) return alert("찾을 숫자를 입력하세요.");
        try {
            const response = await axios.get(`http://localhost:7124/back/api/vaccine/search?vaccineNum=${vaccineNum}`);
            setVaccines([response.data]);
        } catch (error) {
            console.error("백신 검색 실패:", error);
        }
    };

    const addVaccine = async () => {
        if (!petNum || !itemId) return alert("모든 값을 입력하세요.");
        try {
            await axios.post("http://localhost:7124/back/api/vaccine/add", null, {
                params: { petNum, itemId },
            });
            alert("백신 추가 성공!");
        } catch (error) {
            console.error("백신 추가 실패:", error);
        }
    };

    const selectVaccineForEdit = (vaccine: Vaccine) => {
        setSelectedVaccine(vaccine);
        setVaccineNum(String(vaccine.vaccineNum));
        setPetNum(String(vaccine.petNum));
        setItemId(vaccine.itemId);
    };

    const updateVaccine = async () => {
        if (!vaccineNum || !petNum || !itemId) return alert("모든 값을 입력하세요.");
        try {
            await axios.post("http://localhost:7124/back/api/vaccine/update", null, {
                params: { vaccineNum, petNum, itemId, managerNum: selectedVaccine?.managerNum },
            });
            alert("백신 수정 성공!");
            setSelectedVaccine(null);  // 수정 후 선택된 백신 초기화
        } catch (error) {
            console.error("백신 수정 실패:", error);
        }
    };

    const formatDate = (vaccineDate: Date) => {
        const vaccinedate = new Date(vaccineDate);
        return vaccinedate.toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">백신 관리</h1>

            {/* 검색 폼 */}
            <div className="flex gap-2 mb-4">
                <input
                    type="number"
                    placeholder="백신 번호"
                    value={vaccineNum}
                    onChange={(e) => setVaccineNum(e.target.value)}
                    className="border rounded-md p-2 flex-1"
                />
                <button
                    onClick={searchVaccine}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    검색
                </button>
            </div>

            {/* 백신 추가 폼 */}
            <div className="flex gap-2 mb-6">
                <input
                    type="number"
                    placeholder="매니저 번호"
                    value={vaccineNum}
                    onChange={(e) => setVaccineNum(e.target.value)}
                    className="border rounded-md p-2 flex-1"
                />
                <input
                    type="number"
                    placeholder="반려동물 번호"
                    value={petNum}
                    onChange={(e) => setPetNum(e.target.value)}
                    className="border rounded-md p-2 flex-1"
                />
                <input
                    type="text"
                    placeholder="아이템 ID"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    className="border rounded-md p-2 flex-1"
                />
                <button
                    onClick={addVaccine}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    추가
                </button>
            </div>

            {/* 백신 수정 폼 */}
            {selectedVaccine && (
                <div className="flex gap-2 mb-6">
                    <input
                        type="number"
                        placeholder="매니저 번호"
                        value={selectedVaccine.managerNum}
                        readOnly
                        className="border rounded-md p-2 flex-1 bg-gray-100"
                    />
                    <input
                        type="number"
                        placeholder="반려동물 번호"
                        value={petNum}
                        onChange={(e) => setPetNum(e.target.value)}
                        className="border rounded-md p-2 flex-1"
                    />
                    <input
                        type="text"
                        placeholder="아이템 ID"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        className="border rounded-md p-2 flex-1"
                    />
                    <button
                        onClick={updateVaccine}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                        수정
                    </button>
                </div>
            )}

            {/* 백신 테이블 */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">백신 번호</th>
                            <th className="border p-2">백신 날짜</th>
                            <th className="border p-2">반려동물 번호</th>
                            <th className="border p-2">매니저 번호</th>
                            <th className="border p-2">아이템 ID</th>
                            <th className="border p-2">수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaccines.map((vaccine) => (
                            <tr key={vaccine.vaccineNum} className="hover:bg-gray-50">
                                <td className="border p-2 text-center">{vaccine.vaccineNum}</td>
                                <td className="border p-2 text-center">{formatDate(vaccine.vaccineDate)}</td>
                                <td className="border p-2 text-center">{vaccine.petNum}</td>
                                <td className="border p-2 text-center">{vaccine.managerNum}</td>
                                <td className="border p-2 text-center">{vaccine.itemId}</td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() => selectVaccineForEdit(vaccine)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        수정
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4 gap-4">
                <button
                    disabled={!pageInfo?.hasPrevPage}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
                >
                    이전
                </button>
                <span className="px-4 py-2">{pageInfo?.currentPage} / {pageInfo?.totalPages}</span>
                <button
                    disabled={!pageInfo?.hasNextPage}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Vaccine;
