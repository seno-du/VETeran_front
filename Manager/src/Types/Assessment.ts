export interface SearchResult {
    score: number;
    source: {
        증상코드: string;
        증상분류_한글: string;
        증상분류_영어: string;
        증상목록코드: string;
        증상명: string;
    };
    highlight: {
        증상명: string[];
    }
}

export interface SearchResponse {
    total: number;
    hits: SearchResult[];
}

export interface WebSocketResponse {
    status: "success" | "error";
    data?: SearchResponse;
    message?: string;
}