import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import AssessmentTable from "./AssessmentTable";
import { useWebSocket } from "../../Hooks/UseWebSocket";
import { useChartSearchStore } from "../../zustand/ChartSearchQuery";
import type { SearchResponse, WebSocketResponse } from "../../Types/Assessment";
import {useChartStore} from "../../zustand/ChartStore.ts";

const WS_URL = 'ws://localhost:5985/elasticsearch/ws/search';

const Assessment: React.FC = () => {
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const { assessment } = useChartSearchStore();
    const chartStore = useChartStore()

    const handleMessage = (response: WebSocketResponse) => {
        if (response.status === "success" && response.data) {
            setSearchResults(response.data);
        }
    };


    const { isConnected, sendMessage } = useWebSocket({
        url: WS_URL,
        onMessage: handleMessage
    });

    useEffect(() => {
        if (!assessment) return;

        const timeoutId = setTimeout(() => {
            sendMessage({ query: assessment });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [assessment, sendMessage]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <span className="text-teal-600">◢</span>
                <span>Assessment</span>
                <span className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? '연결됨' : '연결안됨'}
                </span>
                <span className="text-xs text-gray-500">(현재 : {chartStore.assessment ? chartStore.assessment : "선택 안됨"})</span>
                {searchResults && (
                    <span className="text-xs text-gray-500">
                        검색결과: {searchResults.total}건
                    </span>
                )}
            </h3>
            <SearchBar section="assessment"/>
            <div className="h-48 overflow-y-auto">
                <AssessmentTable results={searchResults?.hits}/>
            </div>
        </div>
    );
};

export default Assessment;