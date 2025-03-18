import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface ChatRoom {
    chatroomNum: number;
    chatroomName: string;
    chatroomGroup: string;
}

interface ChatRoomProps {
    onSelect?: (chatroomNum: number) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onSelect }) => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>({});
    const [stompClient, setStompClient] = useState<Client | null>(null);
    console.log(stompClient)
    const [accessToken, setAccessToken] = useState<string | null>(null);
    console.log(accessToken)
    const [currentManagerNum, setCurrentManagerNum] = useState<number | undefined>(undefined);

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            setAccessToken(token);
            setCurrentManagerNum(getManagerNumFromToken(token)); // JWT에서 managerNum 추출하여 상태에 저장
        }
    }, []);

    // JWT 토큰에서 managerNum 추출하는 함수 추가
    const getManagerNumFromToken = (token: string | null): number | undefined => {
        if (!token) return undefined;
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // JWT의 payload 디코딩
            return payload.managerNum ? Number(payload.managerNum) : undefined;
        } catch (error) {
            console.error("토큰 디코딩 오류:", error);
            return undefined;
        }
    };

    // 채팅방 목록 가져오기
    const fetchChatRooms = async () => {
        const token = sessionStorage.getItem("accessToken");
        try {
            const response = await axios.get(`http://localhost:7124/back/api/messages/chatrooms`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setChatRooms(response.data);
        } catch (error) {
            console.error("❌ 채팅방 목록을 가져오는 데 실패했습니다.", error);
        }
    };

    // 특정 채팅방의 읽지 않은 메시지 개수 가져오기
    const fetchUnreadCount = async (chatroomNum: number) => {
        const token = sessionStorage.getItem("accessToken");
        try {
            const response = await axios.get(`http://localhost:7124/back/api/messages/chatroom/${chatroomNum}/unreadcount`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUnreadCounts((prev) => ({ ...prev, [chatroomNum]: response.data }));
        } catch (error) {
            console.error(`❌ 채팅방 ${chatroomNum}의 읽지 않은 메시지 개수를 가져오는 데 실패했습니다.`, error);
        }
    };

    // 모든 채팅방의 읽지 않은 메시지 개수 가져오기
    const fetchAllUnreadCounts = useCallback(async () => {
        for (const room of chatRooms) {
            await fetchUnreadCount(room.chatroomNum);
        }
    }, [chatRooms]);
    
    useEffect(() => {
        fetchAllUnreadCounts();
    }, [fetchAllUnreadCounts]);

    // 채팅방 클릭 시, 메시지를 읽음 처리
    const handleChatRoomClick = async (chatroomNum: number) => {

        const token = sessionStorage.getItem("accessToken")
        try {
            await axios.post(`http://localhost:7124/back/api/messages/chatroom/${chatroomNum}/read`,
                null,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );
            onSelect?.(chatroomNum);
            fetchUnreadCount(chatroomNum); // 클릭한 채팅방의 읽지 않은 메시지 개수 업데이트
        } catch (error) {
            console.error(`❌ 채팅방 ${chatroomNum}의 메시지를 읽음 처리하는 데 실패했습니다.`, error);
        }
    };

    // ✅ WebSocket 연결 및 메시지 감지
    useEffect(() => {
        if (currentManagerNum === undefined) {
            console.warn("⚠️ managerNum을 아직 가져오지 못함. WebSocket 연결 대기.");
            return;
        }

        const socket = new SockJS('http://localhost:7124/back/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 자동 재연결 설정
            onConnect: () => {
                console.log("✅ WebSocket 연결됨");

                client.subscribe('/topic/messages', (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    console.log("📩 WebSocket으로 받은 메시지:", receivedMessage);

                    // 본인이 보낸 메시지는 무시
                    if (receivedMessage.managerNum === currentManagerNum) {
                        console.log("✅ 본인이 보낸 메시지이므로 알람 제외");
                        return;
                    }

                    fetchAllUnreadCounts(); // 본인이 보낸 메시지가 아닐 때만 알람 업데이트
                });
                setStompClient(client);
            },
            onStompError: (frame) => console.error("❌ STOMP 오류:", frame),
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [currentManagerNum, fetchAllUnreadCounts]);

    // ✅ 초기 채팅방 목록 불러오기
    useEffect(() => {
        fetchChatRooms();
    }, []);

    // ✅ 채팅방이 변경될 때마다 읽지 않은 메시지 개수 업데이트
    useEffect(() => {
        if (chatRooms.length > 0) {
            fetchAllUnreadCounts();
        }
    }, [chatRooms, fetchAllUnreadCounts]);

    return (
        <div className="overflow-y-auto max-h-[500px] p-4 space-y-2">
            {chatRooms.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">채팅방이 없습니다.</p>
            ) : (
                chatRooms.map((room, index) => (
                    <div
                        key={`${room.chatroomNum} - ${index}`}
                        onClick={() => handleChatRoomClick(room.chatroomNum)}
                        className="flex justify-between items-center p-4 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-yellow-100 transition-all"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{room.chatroomName}</h3>
                            <p className="text-sm text-gray-600">{room.chatroomGroup}</p>
                        </div>
                        {unreadCounts[room.chatroomNum] > 0 && (
                            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                {unreadCounts[room.chatroomNum]}
                            </span>
                        )}
                    </div>
                ))
            )}
        </div>
    );

};

export default ChatRoom;
