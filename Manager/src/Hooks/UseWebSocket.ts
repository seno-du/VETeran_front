import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketHookProps {
    url: string;
    onMessage: (data: any) => void;
}

export const useWebSocket = ({ url, onMessage }: WebSocketHookProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(url);

        ws.onopen = () => {
            setIsConnected(true);
            wsRef.current = ws;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error("응답 파싱 에러:", error);
            }
        };

        ws.onclose = ws.onerror = () => {
            setIsConnected(false);
            wsRef.current = null;
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
        };

        return ws;
    }, [url, onMessage]);

    const sendMessage = useCallback((message: any) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.log('WebSocket 연결되지 않음');
            return;
        }

        try {
            wsRef.current.send(JSON.stringify(message));
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    }, []);

    useEffect(() => {
        const ws = connect();
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [connect]);

    return { isConnected, sendMessage };
};