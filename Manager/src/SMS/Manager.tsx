import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaUserEdit } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface Manager {
  managerNum: number;
  managerName: string;
  managerLicenseNum: string;
  managerId: string;
  managerPwd: string;
  managerPhone: string;
  managerEmail: string;
  managerBirth: Date;
  managerGender: string;
  managerAddress: string;
  managerSignupDate: Date;
  permissionState: string;
}

interface PageDTO {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Manager: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);  // 전체 관리자 목록
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]); // 검색된 관리자 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [currentManager, setCurrentManager] = useState<Manager | null>(null); // 수정할 관리자 정보
  const [pageInfo, setPageInfo] = useState<PageDTO | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const managerPhoneRef = useRef<string>('');
  const managerAddressRef = useRef<string>('');
  const permissionStateRef = useRef<string>('');

  // 데이터 가져오기
  const fetchManagers = (page: number) => {
    axios.get<Manager[]>(`http://localhost:7124/back/api/managers/manager/all?page=${page}`)
      .then(response => {
        setManagers(response.data.list);
        setFilteredManagers(response.data.list);
        setPageInfo(response.data.PageDTO);
      })
      .catch(error => {
        console.error('데이터 불러오기 실패:', error);
      });
  };

  useEffect(() => {
    fetchManagers(currentPage);
  }, [currentPage]);

  // 검색어가 변경될 때마다 필터링된 관리자 목록 업데이트
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);

    // 이름으로 검색, 대소문자 구분 없이 검색
    const filtered = managers.filter(manager =>
      manager.managerName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredManagers(filtered);  // 필터링된 목록 업데이트
  };

  const openEditModal = (manager: Manager) => {
    setCurrentManager(manager);
    managerPhoneRef.current = manager.managerPhone;
    managerAddressRef.current = manager.managerAddress;
    permissionStateRef.current = manager.permissionState;
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (currentManager) {
      const updatedManager = {
        ...currentManager,
        managerPhone: managerPhoneRef.current,
        managerAddress: managerAddressRef.current,
        permissionState: permissionStateRef.current
      };

      axios.put(`http://localhost:7124/back/api/managers/update/${currentManager.managerNum}`, updatedManager)
        .then((response) => {
          console.log('수정 성공:', response.data);

          // 수정된 데이터를 상태에 반영
          setManagers(prevManagers =>
            prevManagers.map(manager =>
              manager.managerNum === currentManager.managerNum ? response.data : manager
            )
          );

          // 필터링된 목록도 업데이트
          setFilteredManagers(prevFilteredManagers =>
            prevFilteredManagers.map(manager =>
              manager.managerNum === currentManager.managerNum ? response.data : manager
            )
          );

          // 관리자 목록 새로고침
          fetchManagers(currentPage);  // 수정 후 다시 데이터를 가져옵니다.

          setIsEditModalOpen(false); // 수정 모달 닫기
        })
        .catch((error) => {
          console.error('수정 실패:', error.message);
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Manager) => {
    let { value } = e.target;
    
    switch (field) {
      case 'managerPhone':
        managerPhoneRef.current = value;
        break;
      case 'managerAddress':
        managerAddressRef.current = value;
        break;
      case 'permissionState':
        permissionStateRef.current = value;
        break;
      default:
        break;
    }
  };


  const handleCheckboxChange = () => {
    if (currentManager) {
      const updatedPermissionState = permissionStateRef.current === "직원" ? "퇴사" : "직원";
      permissionStateRef.current = updatedPermissionState;
      setCurrentManager((prev) => ({ ...prev!, permissionState: updatedPermissionState }));
    }
  };

  const ModalOverlay = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={() => setIsEditModalOpen(false)}>
          <MdClose size={24} />
        </button>
        {children}
      </div>
    </div>
  );

  const handleNavigate = () => {
    navigate('/ManagerCreate');
  }

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">🐾 동물병원 관리자 목록</h2>

      {/* 검색창 추가 */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="이름으로 검색"
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4 flex justify-end">
        <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600' onClick={handleNavigate}>
          관리자 추가
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="px-4 py-3">✔</th>
              <th className="px-4 py-3">아이디</th>
              <th className="px-4 py-3">이름(성별)</th>
              <th className="px-4 py-3">전화번호</th>
              <th className="px-4 py-3">면허번호</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">생년월일</th>
              <th className="px-4 py-3">주소</th>
              <th className="px-4 py-3">수정</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredManagers.length > 0 ? (
              filteredManagers.map((manager, index) => (
                <tr key={manager.managerNum || index} className="border-b">
                  <td className="px-4 py-3">{manager.permissionState}</td>
                  <td className="px-4 py-3">{manager.managerId}</td>
                  <td className="px-4 py-3">
                    {manager.managerName} ({manager.managerGender})
                  </td>
                  <td className="px-4 py-3">{manager.managerPhone}</td>
                  <td className="px-4 py-3">{manager.managerLicenseNum}</td>
                  <td className="px-4 py-3">{manager.managerEmail}</td>
                  <td className="px-4 py-3">{new Date(manager.managerBirth).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{manager.managerAddress}</td>
                  <td className="px-4 py-3 flex justify-center">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-lg shadow flex text-lg gap-2 hover:bg-green-600"
                      onClick={() => openEditModal(manager)}
                    >
                      <FaUserEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-4 text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && currentManager && (
        <ModalOverlay>
          <h3 className="text-xl font-semibold mb-4">관리자 정보 수정</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">전화번호</label>
              <input
                type="tel"
                className="w-full border rounded p-2"
                defaultValue={currentManager.managerPhone}
                onChange={(e) => handleInputChange(e, 'managerPhone')}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">주소</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                defaultValue={currentManager.managerAddress}
                onChange={(e) => handleInputChange(e, 'managerAddress')}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">활동 상태</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={currentManager.permissionState === '직원'}
                  onChange={handleCheckboxChange}
                />
                <span>직원</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                수정 완료
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6">
        {pageInfo && (
          <>
            {pageInfo.hasPrevPage && (
              <button className="px-4 py-2 bg-gray-300 rounded-lg mx-2" onClick={() => setCurrentPage(currentPage - 1)}>이전</button>
            )}
            <span>{currentPage} / {pageInfo.totalPages}</span>
            {pageInfo.hasNextPage && (
              <button className="px-4 py-2 bg-gray-300 rounded-lg mx-2" onClick={() => setCurrentPage(currentPage + 1)}>다음</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Manager;
