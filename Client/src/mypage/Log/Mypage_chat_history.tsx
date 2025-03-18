import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

interface commWithAi {
    sender: string;
    content: string;
}

const Mypage_chat_history: React.FC = () => {

    const navigate = useNavigate();
    const token = useSelector((state: any) => state.auth.token);
    
    const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 끝을 참조하는 ref
    const [dayList, setDayList] = useState<string[]>([]);
    const [day, setDay] = useState('');
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const today = new Date();

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

    const [messages, setMessages] = useState<commWithAi[]>([]); // 채팅 화면 
    const [summary, setSummary] = useState('');

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

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
    const getChatHistory = async (selectDay: string) => {
        try {

            const response = await axios.get(`http://localhost:7124/back/api/chatbot/getChatHistory/${selectDay}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessages(response.data.chatHistory);
            setSummary(response.data.chatSummary);
            setIsPageLoaded(true);

        } catch (error) {
            console.error('네트워크 오류:', error);
        }
    };

    const getChatHistorydate = async () => {
        try {

            const response = await axios.get(`http://localhost:7124/back/api/chatbot/getChatDateInfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDayList(response.data);
            setDay(response.data[response.data.length - 1]);
            console.log(response.data[response.data.length - 1]);

        } catch (error) {
            console.error('네트워크 오류:', error);
            return '네트워크 오류';
        }
    };

    const formatDate = (date: Date) => {
        return date
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-") // 'yyyy. mm. dd.' → 'yyyy-mm-dd'
            .replace(".", ""); // 마지막 점 제거
    };

    const handleDateChange = (date: Date) => {
        const formattedDate = formatDate(date);
        if (dayList.includes(formattedDate)) {
            setDay(formattedDate);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0); // 페이지 최상단으로 이동
    }, [isPageLoaded]);

    useEffect(() => {
        getUser();
        getChatHistorydate();
    }, [])

    useEffect(() => {
        setIsPageLoaded(false);
        getChatHistory(day);
    }, [day])

    return (
        <div className="min-h-[1000px] bg-gray-50">
            {isPageLoaded ?
                (
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-3xl font-bold text-red-600 text-center mb-4">
                            멍트리오 채팅 내역
                        </h1>

                        <div className="flex flex-row justify-center gap-6 mt-6">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-[90%] h-100 overflow-y-auto">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3 text-red-500" {...props} />,
                                        p: ({ node, ...props }) => <p className="text-gray-800 leading-relaxed" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4" {...props} />,
                                        li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                        code: ({ node, ...props }) => (
                                            <code className="bg-gray-100 p-1 rounded text-sm font-mono text-blue-600" {...props} />
                                        ),
                                    }}
                                >
                                    {summary}
                                </ReactMarkdown>
                            </div>


                            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-[40%]">
                                <Calendar
                                    onChange={(date) => handleDateChange(date as Date)}
                                    tileDisabled={({ date }) => !dayList.includes(formatDate(date))}
                                    tileClassName={({ date, view }) => {
                                        if (view === "month") {
                                            const dateStr = formatDate(date);
                                            if (dateStr === formatDate(today)) {
                                                return "relative bg-white text-red-500 font-bold before:content-[''] before:absolute before:inset-0 before:border-2 before:border-red-500 before:rounded-full";
                                            }
                                            if (dateStr === day) {
                                                return "bg-red-500 bg-opacity-30 text-gray-900 rounded-lg";
                                            }
                                        }
                                        return "";
                                    }}
                                />
                                {day && (
                                    <p className="text-lg font-semibold mt-4 text-gray-800">선택한 날짜: {day}</p>
                                )}
                            </div>
                        </div>

                        <section className="bg-white rounded-lg p-6 shadow-md mt-6">
                            <div
                                className="flex flex-col overflow-y-auto bg-white p-4 rounded-lg shadow-md"
                                style={{ maxHeight: "700px" }}
                            >
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex mb-4 ${msg.sender === "나" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`p-4 rounded-lg text-gray-800 ${msg.sender === "나"
                                                ? "bg-red-500 text-white max-w-[40%]"
                                                : "bg-gray-200 text-gray-800 max-w-[70%]"
                                                }`}
                                        >
                                            <p style={{ whiteSpace: "pre-wrap" }}>
                                                {msg.content.replace(/\\n\\n/g, "\n").replace(/\\n/g, "\n")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-screen text-2xl font-bold text-[#555]">
                        대화를 불러오는 중입니다... 잠시만 기다려주세요! ⏳
                    </div>
                )}
        </div>
    );


}

export default Mypage_chat_history