import React, { useState } from 'react';

// 유저와 메시지 데이터를 위한 타입
type Message = {
  sender: string;
  text: string;
};

const SocialMsg: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);

  const [users, setUsers] = useState<string[]>([]); // 현재 접속 중인 사용자 목록

  // 사용자가 채팅방에 입장
  const handleJoin = () => {
    if (username.trim()) {
      setUsers((prev) => [...prev, username]);
      setMessages((prev) => [
        ...prev,
        { sender: 'System', text: `${username} 님이 입장하셨습니다.` },
      ]);
      setJoined(true);
    }
  };

  // 사용자가 메시지를 전송
  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = { sender: username, text: input };
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
    }
  };

  // 사용자가 채팅방을 떠날 때
  const handleLeave = () => {
    setMessages((prev) => [
      ...prev,
      { sender: 'System', text: `${username} 님이 퇴장하셨습니다.` },
    ]);
    setUsers((prev) => prev.filter((user) => user !== username));
    setJoined(false);
    setUsername('');
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray-100">
      {/* 채팅방 입장 화면 */}
      {!joined ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">단체 채팅방</h1>
          <input
            type="text"
            placeholder="사용자 이름 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            채팅방 입장
          </button>
        </div>
      ) : (
        // 채팅방 UI
        <div className="w-full max-w-3xl flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
          {/* 사용자 목록 및 헤더 */}
          <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">단체 채팅방</h2>
            <button
              onClick={handleLeave}
              className="bg-red-500 text-white px-2 py-1 rounded-lg"
            >
              나가기
            </button>
          </header>

          {/* 사용자 목록 */}
          <div className="flex p-4 bg-gray-100">
            <div className="w-1/3 border-r pr-4">
              <h3 className="font-bold mb-2">참여자 목록</h3>
              <ul className="space-y-1">
                {users.map((user, index) => (
                  <li key={index} className="text-sm">
                    {user}
                  </li>
                ))}
              </ul>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 pl-4">
              <div className="overflow-y-auto h-64 mb-4 border p-2 bg-gray-50">
                {messages.map((message, index) => (
                  <div key={index} className="mb-2">
                    <span
                      className={`font-bold ${
                        message.sender === 'System' ? 'text-gray-500' : 'text-blue-600'
                      }`}
                    >
                      {message.sender}
                    </span>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>

              {/* 메시지 입력창 */}
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-2 border rounded-lg mr-2"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMsg;
