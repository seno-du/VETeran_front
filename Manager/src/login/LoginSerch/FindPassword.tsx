import { Input } from "../loginUiPage/input";
import { Button } from "../loginUiPage/button";
import { Link } from "react-router-dom";

export default function FindPassword() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
      <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800">비밀번호 찾기</h2>
        <div className="mt-6">
          <Input type="text" placeholder="아이디" className="mb-4" />
          <Input type="email" placeholder="이메일" className="mb-4" />
          <Button className="w-full bg-teal-600 hover:bg-teal-800 text-white">비밀번호 찾기</Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link to="/find-id" className="text-teal-600 hover:underline">아이디 찾기</Link> ·
          <Link to="/signup" className="text-teal-600 hover:underline mx-2">회원가입</Link> ·
          <Link to="/" className="text-teal-600 hover:underline">로그인</Link>
        </div>
      </div>
    </div>
  );
}
