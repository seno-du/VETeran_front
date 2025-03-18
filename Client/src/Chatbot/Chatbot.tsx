import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbotStore } from '../zustand/useChatbotStore';
import axios from 'axios';
import { useSelector } from 'react-redux';

interface commWithAi {
  sender: string;
  content: string;
}
const Chatbot: React.FC = () => {

  const navigate = useNavigate();
  const { query } = useChatbotStore();

  const [inputMsg, setInputMsg] = useState<string[]>([]); // 누적 메세지 전송
  const [isLoginModelOpen, setIsLoginModelOpen] = useState(false);
  const [unLoginModelOpen, setUnLoginModelOpen] = useState(false);
  const [activeSender, setActiveSender] = useState(true);
  const [activeChat, setActiveChat] = useState(true);

  const [user, setUser] = useState({
    userNum: 0,
    userName: '',
    userId: '',
    userPwd: '',
    userPhone: '',
    userBirth: '',
    userEmail: '',
    userAddress: '',
    userAddressNum: '',
    userStatus: '',
    userSignupDate: '',
  });

  const token = useSelector((state: any) => state.auth.token);

  const [userRequest, setUserRequest] = useState<string>('');
  const [saveSession, setSaveSession] = useState<commWithAi[]>([]);

  const [messages, setMessages] = useState<commWithAi[]>([  // 채팅창 viewer
    { sender: '멍트리오', content: '궁금한 내용을 물어보세요!' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 끝을 참조하는 ref


  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/user/one`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching community:', error);
    }
  };

  // openai랑 통신하는 함수
  const ReturnAiResponse = async (newMessage: string): Promise<string> => {
    try {
      const updatedMessages = [...inputMsg, newMessage]; // 기존 질문 누적
      const messageString = updatedMessages.join(',');

      const response = await axios.post('http://localhost:7124/back/api/chatbot', {
        message: messageString,
        count: messages.length,
        userNum: user.userNum
      });
      const aiResponse = response.data;
      return aiResponse;

    } catch (error) {
      console.error('네트워크 오류:', error);
      return '네트워크 오류';
    }
  };

  const handleSavdChatHistory = async (messages: commWithAi[]) => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/chatbot/saveChatHistory`, messages,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

    } catch (error) {
      console.error('Error :', error);
    }
  }

  const addMessage = (sender: string, message: string) => {
    setSaveSession((prevMessages) => [
      ...prevMessages,
      { sender, content: message }
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender, content: message }
    ]);

    if (sender == '나') {
      setActiveSender(false);
    } else {
      setActiveSender(true);
    }
  };

  const handleSendMessage = async () => {
    const message = userRequest.trim();
    if (message.length === 0) return;

    addMessage('나', message);
    setInputMsg((prev) => [...prev, message]);
    setUserRequest(''); // 입력 필드 초기화

    const aiResponse = await ReturnAiResponse(message);
    addMessage('멍트리오', aiResponse);
  };

  const handleCloseModel = () => {
    setIsLoginModelOpen(false);
    setUnLoginModelOpen(false);
  };

  const handleIsAuthenticated = (number: number) => {
    if (user.userNum == 0) {
      setIsLoginModelOpen(true);
    } else {
      if (number == 1) {
        navigate('/mypage/chatHistory');
      } else if (number == 2) {
        navigate('/reservation');
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserRequest(event.target.value);
  };

  useEffect(() => {
    getUser();
  }, [])

  useEffect(() => {
    if (saveSession.length == 2 && user.userNum != 0) {
      handleSavdChatHistory(saveSession);
      setSaveSession([]);
    }
  }, [saveSession])

  useEffect(() => {
    if (query) {
      if (!unLoginModelOpen && activeChat) {
        addMessage('나', query);
        ReturnAiResponse(query).then((aiResponse) => {
          addMessage('멍트리오', aiResponse);
        });
      }
    }
  }, [query])

  useEffect(() => {
    if (user.userNum === 0 && messages.length >= 11) {
      setUnLoginModelOpen(true);
      setActiveChat(false);
    }
  }, [messages]);


  // useEffect(() => {
  //   handleIsAuthenticated();
  // }, [messages]);


  return (
    <div className="min-h-screen bg-gray-50"> {/* 전체 페이지 스크롤 */}
      <div className="container mx-auto px-4 py-6">

        <button onClick={() => navigate(-1)} className="text-red-500 mb-4 font-bold">
          ← 뒤로가기
        </button>

        <h1 className="text-3xl font-bold text-red-600 text-center mb-4">
          멍트리오에게 질문하세요!
        </h1>

        <section className="bg-white rounded-lg p-6 shadow-sm min-h-40">

          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md" style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
            {/* 채팅창 영역에서만 스크롤 가능하게 설정 */}
            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${msg.sender === "나" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-4 rounded-lg text-gray ${msg.sender === "나"
                      ? "bg-red-500 text-white max-w-[40%]"
                      : "bg-gray-200 text-gray-800 max-w-[70%]"
                      }`}
                  >
                    {msg.content.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* 메시지 끝을 참조 */}
            </div>
          </div>

          {activeChat && (
            <>
              {/* 검색 입력창 */}
              <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-md">
                <input
                  type="text"
                  className="flex-grow outline-none text-gray-700"
                  placeholder="멍트리오에게 질문하세요!"
                  value={userRequest}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && activeSender) {
                      handleSendMessage();
                    }
                  }}
                />
                <button className="ml-2 text-gray-500" onClick={handleSendMessage} disabled={activeSender == false}>
                  전송
                </button>
              </div>
            </>
          )}
          <div className="mt-4 flex justify-center">
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => handleIsAuthenticated(2)} className="bg-gray-300 text-gray-800 px-6 py-3 text-lg rounded-lg shadow-sm hover:bg-gray-400">
                진료 예약하기
              </button>
              <button onClick={() => handleIsAuthenticated(1)} className="bg-red-500 text-white px-6 py-3 text-lg rounded-lg shadow-sm hover:bg-red-600">
                채팅 내역 조회
              </button>
            </div>
          </div>
        </section>

        {isLoginModelOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <div className="w-full max-w-md">
                <p className="text-center text-lg mb-4">로그인이 필요한 서비스입니다.</p>
                <button
                  onClick={() => navigate('/login/form')}
                  className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                >
                  로그인 창으로 이동하기
                </button>
              </div>
              <button
                onClick={handleCloseModel}
                className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
              >
                닫기
              </button>
            </div>
          </div>
        )}
        {unLoginModelOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <div className="w-full max-w-md">
                <p className="text-center text-lg mb-4">더 많은 채팅을 위해 로그인이 진행해주세요.</p>
                <button
                  onClick={() => navigate('/login/form')}
                  className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                >
                  로그인 창으로 이동하기
                </button>
                <button
                  onClick={handleCloseModel}
                  className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                >
                  채팅창으로 돌아가기
                </button>
              </div>
              <button
                onClick={handleCloseModel}
                className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div >
    </div >
  );
};

export default Chatbot;