import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter';
import { useChatbotStore } from '../zustand/useChatbotStore';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const ChatMain: React.FC = () => {
    const navigate = useNavigate();
    const { setQuery } = useChatbotStore();
    const [input, setInput] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag);
        if (tag === '관절') {
            setInput(`우리 아이가 ${tag}이 안좋아요`);
        } else if (tag === '피부질환' || tag === '안과질환') {
            setInput(`우리 아이가 ${tag}이 있어요`);
        } else {
            if (tag === '발작') {
                setInput(`우리 아이가 ${tag}을 했어요`);
            }
            else setInput(`우리 아이가 ${tag}를 했어요`);
        }
    };

    const handleSearch = () => {
        if (input.trim() === '') return;
        setQuery(input); // Zustand 상태 저장
        navigate('/chatbot');
    };

    return (
        <div className="flex flex-col items-center justify-center bg-transparent text-center p-8">
            <div className="text-3xl md:text-5xl font-bold text-white whitespace-nowrap overflow-hidden">
                <Typewriter
                    words={['반려동물 고민? 멍트리오에게 물어보세요!']}
                    loop={false} // 반복 비활성화
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={50}
                    delaySpeed={3000}
                />
            </div>


            <div className="mt-8 w-full max-w-lg flex items-center border border-white-500 rounded-full px-6 py-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="현재 고민을 설명해 주세요"
                    className="w-full outline-none text-white placeholder-gray-300 bg-transparent text-xl"
                />
                <button onClick={handleSearch} className="text-white text-3xl">
                    <Search className="h-7 w-7 text-white" />
                </button>

            </div>

            <div className="mt-6 flex flex-wrap gap-4">
                {['피부질환', '구토', '설사', '안과질환', '관절', '발작'].map((item) => (
                    <button
                        key={item}
                        onClick={() => handleTagClick(item)}
                        className={`px-6 py-3 rounded-full shadow-lg text-lg transition ${selectedTag === item
                            ? 'bg-red-500 text-white'
                            : 'bg-black text-white hover:bg-gray-800'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatMain;
