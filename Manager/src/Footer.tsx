import { useState, useEffect } from "react";
import axios from "axios";
import ChatRoom from "./SMS/ChatRoom";
import Chat from "./SMS/Chat";
import ChatRoomMember from "./SMS/ChatRoomMember";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SERVER_URL = "http://localhost:7124/back";

const Footer: React.FC = () => {
    const [announcementOpen, setAnnouncementOpen] = useState(0);
    const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
    const [isCreateChatRoomPopupOpen, setIsCreateChatRoomPopupOpen] = useState(false);
    const [selectedChatRoom, setSelectedChatRoom] = useState<number | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [currentManagerNum, setCurrentManagerNum] = useState<number | undefined>(undefined);
    console.log(stompClient, accessToken)

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            setAccessToken(token);
            setCurrentManagerNum(getManagerNumFromToken(token));
        }
    }, []);

    const getManagerNumFromToken = (token: string | null): number | undefined => {
        if (!token) return undefined;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.managerNum ? Number(payload.managerNum) : undefined;
        } catch (error) {
            console.error("토큰 디코딩 오류:", error);
            return undefined;
        }
    };

    // 안 읽은 메시지 개수 가져오기
    useEffect(() => {
        const fetchTotalUnreadCount = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                if (!token) {
                    console.error("❌ 토큰이 없습니다.");
                    return;
                }

                const response = await axios.get(`${SERVER_URL}/api/messages/unreadcount`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUnreadCount(response.data);
            } catch (error) {
                console.error("❌ 안 읽은 메시지 개수를 가져오는 데 실패했습니다.", error);
            }
        };

        fetchTotalUnreadCount();
    }, []);

    // WebSocket 연결 & 구독
    useEffect(() => {
        if (!currentManagerNum) return;

        console.log("WebSocket 연결 시도...");

        const socket = new SockJS(`${SERVER_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket 연결됨");

                // 새 메시지가 도착할 때 unreadCount 증가
                client.subscribe("/topic/messages", (msg) => {
                    const receivedMessage = JSON.parse(msg.body);
                    if (receivedMessage.managerNum !== currentManagerNum) {
                        console.log("새 메시지 도착 - unreadCount 증가");
                        setUnreadCount((prevCount) => prevCount + 1);
                    }
                });

                // 서버에서 안 읽은 메시지 개수 업데이트 신호 받기
                client.subscribe(`/topic/unreadcount/${currentManagerNum}`, (msg) => {
                    console.log("안 읽은 메시지 개수 업데이트:", msg.body);
                    setUnreadCount(parseInt(msg.body, 10));
                });

                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error("STOMP 오류:", frame);
            },
        });

        client.activate();

        return () => {
            console.log("🔌 WebSocket 연결 해제");
            client.deactivate();
        };
    }, [currentManagerNum]);


    // 안 읽은 메시지 개수 초기화
    useEffect(() => {
        if (isChatPopupOpen && selectedChatRoom) {
            const markMessagesAsRead = async () => {
                try {
                    const token = sessionStorage.getItem("accessToken");
                    if (!token) return;

                    await axios.get(`${SERVER_URL}/api/messages/chatRoom/readcount`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // 🔹 안 읽은 개수 0으로 초기화
                    setUnreadCount(0);
                } catch (error) {
                    console.error("❌ 메시지 읽음 처리 실패", error);
                }
            };

            markMessagesAsRead();
        }
    }, [isChatPopupOpen, selectedChatRoom]);

    const toggleChatPopup = () => {
        setIsChatPopupOpen(!isChatPopupOpen);
        if (isChatPopupOpen) {
            setSelectedChatRoom(null);
        }
    };

    const handleChatRoomSelect = (chatroomNum: number) => {
        setSelectedChatRoom(chatroomNum);
    };

    const toggleCreateChatRoomPopup = () => {
        setIsCreateChatRoomPopupOpen(!isCreateChatRoomPopupOpen);
        setIsChatPopupOpen(false);
    };

    return (
        <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="fixed flex gap-4 bottom-4 right-4">
                {/* <button
                    onClick={() => setAnnouncementOpen(announcementOpen ? 0 : 1)}
                    className="px-6 py-2 text-xl text-white bg-yellow-500 rounded-full"
                >
                    공지사항
                </button> */}

                <button
                    onClick={toggleChatPopup}
                    className="relative px-6 py-2 text-xl text-white bg-yellow-500 rounded-full"
                >
                    채팅
                    {unreadCount > 0 && (
                        <span className="absolute px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* {announcementOpen === 1 && (
                <div className="fixed bottom-0 right-0 w-1/5 h-full text-white bg-gray-800">
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-xl cursor-pointer">📢 공지사항</div>
                    </div>
                </div>
            )} */}

            {isChatPopupOpen && (
                <div className="fixed bottom-16 right-4 w-[500px] h-[600px] bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between bg-yellow-300 p-7">
                        <button className="text-xl font-bold text-gray-800" onClick={() => setSelectedChatRoom(null)}>
                            채팅방 목록
                        </button>
                        <button onClick={toggleCreateChatRoomPopup} className="text-gray-500">
                            생성
                        </button>
                        <button onClick={toggleChatPopup} className="text-gray-500">
                            닫기
                        </button>
                    </div>
                    {selectedChatRoom ? (
                        <Chat selectedChatRoom={selectedChatRoom} />
                    ) : (
                        <ChatRoom onSelect={handleChatRoomSelect} />
                    )}
                </div>
            )}

            {isCreateChatRoomPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="p-8 bg-white rounded-lg shadow-lg w-96">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">채팅방 생성</h2>
                            <button onClick={toggleCreateChatRoomPopup} className="text-gray-500">
                                닫기
                            </button>
                        </div>
                        <ChatRoomMember />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Footer;
