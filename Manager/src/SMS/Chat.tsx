import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, Frame } from '@stomp/stompjs';
import axios from 'axios';

interface Message {
    messageNum?: number; // optional: 클라이언트에서 임시 고유값 부여
    chatroomNum: number;
    managerNum: number;
    messageContent: string;
    messageCreatedAt: number;
    messagetype: string;
    messageState: string;
    managerName?: string;
}

interface ChatProps {
    selectedChatRoom?: number;
}

const Chat: React.FC<ChatProps> = ({ selectedChatRoom }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClientRef = useRef<Client | null>(null);
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const logPath = "http://localhost:7124/back";
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
        "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🤗", "🤩",
        "😏", "😮", "😯", "😲", "🥳", "😳", "🥺", "😭", "😡", "🤬"];

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [currentManagerNum, setCurrentManagerNum] = useState<number | undefined>(undefined);

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            setAccessToken(token);
            setCurrentManagerNum(getManagerNumFromToken(token));
        }
    }, []);

    // JWT 토큰에서 managerNum 추출
    const getManagerNumFromToken = (token: string | null): number | undefined => {
        if (!token) return undefined;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.managerNum ? Number(payload.managerNum) : undefined;
        } catch (error) {
            console.error("토큰 디코딩 오류:", error);
            return undefined;
        }
    };

    // 선택된 채팅방 변경 시 STOMP 연결 설정
    useEffect(() => {
        if (!selectedChatRoom) return;

        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }

        const socket = new SockJS(`${logPath}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 0,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log(`✅ WebSocket 연결됨 (채팅방: ${selectedChatRoom})`);
                client.subscribe(`/topic/messages/${selectedChatRoom}`, (msg) => {
                    const receivedMessage: Message = JSON.parse(msg.body);
                    if (!receivedMessage.messageContent) return;
                    setMessages(prev => [...prev, receivedMessage]);
                });
                stompClientRef.current = client;
            },
            onStompError: (frame: Frame) => {
                console.error('❌ STOMP 오류:', frame);
            },
        });
        client.activate();

        return () => {
            client.deactivate();
        };
    }, [selectedChatRoom]);


    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 전송 함수
    const sendMessage = () => {
        if (newMessage.trim() && stompClientRef.current && stompClientRef.current.connected) {
            const managerNum = getManagerNumFromToken(accessToken);
            if (managerNum === undefined) {
                console.warn("managerNum 추출 실패.");
                return;
            }
            // selectedChatRoom이 없으면 메시지 전송 불가
            if (!selectedChatRoom) {
                console.warn("채팅방이 선택되지 않았습니다.");
                return;
            }
            // 임시 고유 id 부여
            const tempId = Date.now();
            const messagePayload: Message = {
                messageNum: tempId,
                chatroomNum: selectedChatRoom,
                managerNum,
                messageContent: newMessage,
                messageCreatedAt: Date.now(),
                messagetype: '텍스트',
                messageState: '보냄',
            };
            // 서버로 메시지 전송 (서버가 브로드캐스트하면 모든 클라이언트에서 수신)
            stompClientRef.current.publish({
                destination: `/app/chat`,
                body: JSON.stringify(messagePayload),
            });
            setNewMessage('');
        } else {
            console.warn("⚠️ WebSocket 연결 안됨.");
        }
    };

    // 초기 채팅방 메시지 불러오기
    useEffect(() => {
        const fetchMessages = async () => {
            const token = sessionStorage.getItem("accessToken");
            try {
                const response = await axios.get(`${logPath}/api/messages/chatroom/${selectedChatRoom}`, {
                    headers: { Authorization: "Bearer " + token }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('메시지 불러오기 실패:', error);
            }
        };
        fetchMessages();
    }, [selectedChatRoom, logPath]);

    // 이미지 업로드 처리
    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const managerNum = getManagerNumFromToken(accessToken);
            if (managerNum === undefined) {
                console.warn("managerNum 추출 실패.");
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('chatroomNum', String(selectedChatRoom));
            formData.append('managerNum', String(managerNum));

            try {
                // 서버가 업로드와 동시에 DB 기록 및 STOMP 브로드캐스트를 수행합니다.
                await axios.post(`${logPath}/api/messages/uploadImage`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("이미지 업로드 성공, 서버가 메시지 브로드캐스트 진행");
            } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드에 실패했습니다.");
            }
        }
    };

    // 타임존 형식을 보정하는 함수
    const fixTimezoneFormat = (timestampStr: string): string => {
        // 만약 문자열이 +09로 끝난다면, ":00"을 추가합니다.
        if (/([+-]\d{2})$/.test(timestampStr)) {
            return timestampStr + ":00";
        }
        // 만약 +0900 같이 4자리 숫자라면, 중간에 콜론을 추가합니다.
        return timestampStr.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
    };

    // 시간(시:분)을 "HH:mm" 형식으로 반환하는 함수
    const formatTime = (timestamp: string | number): string => {
        let ts = timestamp;
        if (typeof ts === "string") {
            ts = fixTimezoneFormat(ts);
        }
        const date = new Date(ts);
        if (isNaN(date.getTime())) {
            console.warn("Invalid timestamp:", ts);
            return "Invalid Date";
        }
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };




    return (
        <div className="right-4 w-[500px] h-[86%] bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden border border-gray-300">
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {messages.map((message) => (
                    <div key={message.messageNum} className={`flex items-end ${message.managerNum === currentManagerNum ? 'justify-end' : 'justify-start'}`}>
                        {message.managerNum !== currentManagerNum && (
                            <div className="text-gray-600 text-sm font-medium mr-2">
                                {message.managerName}
                            </div>
                        )}
                        <div className={`relative max-w-xs p-3 rounded-xl shadow-md ${message.managerNum === currentManagerNum ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {message.messagetype === '이미지' ? (
                                <img
                                    src={`${logPath}/${message.messageContent.startsWith("/") ? message.messageContent.substring(1) : message.messageContent}`}
                                    alt="Uploaded"
                                    className="w-40 h-40 rounded-lg"
                                />
                            ) : (
                                message.messageContent
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {formatTime(message.messageCreatedAt)}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-100 border-t border-gray-300">
                <button className="text-gray-400 hover:text-gray-600" onClick={handleImageUploadClick}>📷</button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="relative emoji-container">
                    <button
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        😃
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute bottom-14 right-2 w-52 bg-white border rounded-lg shadow-lg p-3 grid grid-cols-4 gap-0">
                            {emojis.map((emoji, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setNewMessage(prev => prev + emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                    className="text-2xl hover:bg-gray-200 p-2 rounded"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={sendMessage} className="bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500">
                    전송
                </button>
            </div>
        </div>
    );
};

export default Chat;
