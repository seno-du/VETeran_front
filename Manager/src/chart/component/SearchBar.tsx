import { Search } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useChartSearchStore } from "../../zustand/ChartSearchQuery.ts";

interface SearchBarProps {
    section: 'assessment' | 'plan';
}

const SearchBar: React.FC<SearchBarProps> = ({ section }) => {
    const [query, setQuery] = useState("");
    const { setAssessment, setPlan } = useChartSearchStore();

    // 검색 핸들러
    const handleSearch = useCallback(() => {
        if (section === "assessment") {
            setAssessment(query);
        } else {
            setPlan(query);
        }
    }, [query, section, setAssessment, setPlan]);

    // Enter 키 핸들러
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex gap-2 mb-3">
            <div className="flex-grow relative">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Search className="absolute left-2.5 top-2 text-gray-400" size={16} />
            </div>
            <button
                className="px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm"
                onClick={handleSearch}
            >
                검색
            </button>
        </div>
    );
};

export default SearchBar;