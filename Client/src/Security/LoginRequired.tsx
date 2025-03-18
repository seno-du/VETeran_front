import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthStore } from "../zustand/IsAuth.ts";
import { useSelector } from "react-redux";

interface Props {
    children: ReactNode;
}

const LoginRequired = ({ children }: Props) => {
    const navigate = useNavigate();
    const { isAuth, setIsAuth } = useIsAuthStore(); // Zustand 상태
    const token = useSelector((state: any) => state.auth.token); // Redux 상태

    useEffect(() => {

    }, []);

    return isAuth ? <>{children}</> : null; // 인증될 때만 children 렌더링
};

export default LoginRequired;
