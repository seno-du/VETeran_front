import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
}

const ChatRoomMember: React.FC = () => {
  const [chatRoomName, setChatRoomName] = useState<string>('');
  const [chatRoomGroup, setChatRoomGroup] = useState<string>('');
  const [selectedManagers, setSelectedManagers] = useState<number[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  console.log(accessToken, "accessToken")

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get('http://localhost:7124/back/api/managers/managerPlus');
      setManagers(response.data);
    } catch (error) {
      console.error('매니저 목록을 불러오는 데 실패했습니다.', error);
    }
  };

  const handleCreateChatRoom = async () => {
    const token = sessionStorage.getItem("accessToken");

    if (chatRoomName && chatRoomGroup && selectedManagers.length > 0) {
      try {
        const response = await axios.post(
          "http://localhost:7124/back/api/messages/chatroom/create",
          {
            chatroomName: chatRoomName,
            chatroomGroup: chatRoomGroup,
            managerNums: selectedManagers, // params가 아니라 body로 전송
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // JSON 데이터임을 명시
            },
          }
        );
        setResponseMessage(response.data);
        clearForm();
        setIsFormVisible(false);
      } catch (error) {
        console.error("채팅방 생성 실패:", error);
        setResponseMessage("채팅방 생성에 실패했습니다.");
      }
    } else {
      setResponseMessage("채팅방 이름, 그룹, 관리자를 모두 선택해야 합니다.");
    }
  };


  const handleManagerSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (chatRoomGroup === '개인') {
      setSelectedManagers([value]);
    } else {
      setSelectedManagers((prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((managerNum) => managerNum !== value)
          : [...prevSelected, value]
      );
    }
  };

  const clearForm = () => {
    setChatRoomName('');
    setChatRoomGroup('');
    setSelectedManagers([]);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center">채팅방 생성</h2>
      {isFormVisible ? (
        <>
          <input
            type="text"
            placeholder="채팅방 이름"
            value={chatRoomName}
            onChange={(e) => setChatRoomName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={chatRoomGroup}
            onChange={(e) => setChatRoomGroup(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">채팅방 그룹</option>
            <option value="개인">개인</option>
            <option value="단체">단체</option>
          </select>
          <div className="max-h-60 overflow-y-auto p-3 border rounded">
            {managers.map((manager) => (
              <label key={manager.managerNum} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={manager.managerNum}
                  onChange={handleManagerSelection}
                  checked={selectedManagers.includes(manager.managerNum)}
                  className="accent-blue-500"
                />
                <span>{manager.managerName}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleCreateChatRoom}
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            채팅방 생성
          </button>
        </>
      ) : (
        <div className="text-center p-4 bg-green-100 text-green-700 rounded">
          채팅방이 성공적으로 생성되었습니다!
        </div>
      )}
      {responseMessage && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-center">
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ChatRoomMember;
