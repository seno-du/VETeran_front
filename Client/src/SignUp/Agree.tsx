import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AgreeText: React.FC<{ path: string }> = ({ path }) => {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const text = await response.text();
                    setContent(text);
                } else {
                    console.error("파일을 불러오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("에러 발생:", error);
            }
        };

        fetchContent();
    }, [path]);

    return <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</p>;
};

const Agree: React.FC = () => {
    const [term1Checked, setTerm1Checked] = useState(false);
    const [term2Checked, setTerm2Checked] = useState(false);
    const [term3Checked, setTerm3Checked] = useState(false);
    const [term4Checked, setTerm4Checked] = useState(false);
    const [termAllChecked, setTermAllChecked] = useState(false);
    const navigate = useNavigate();

    const handleAllAgree = () => {
        const newCheckedValue = !termAllChecked;
        setTerm1Checked(newCheckedValue);
        setTerm2Checked(newCheckedValue);
        setTerm3Checked(newCheckedValue);
        setTerm4Checked(newCheckedValue);
        setTermAllChecked(newCheckedValue);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (term1Checked && term2Checked && term3Checked && term4Checked) {
            alert("모든 약관에 동의하셨습니다.");
            navigate("/signup/signupmethod");
        } else {
            alert("모든 약관에 동의해야 가입이 가능합니다.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-5xl">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">약관 동의</h1>
                <p className="text-gray-500 text-center text-base mb-6">서비스를 이용하시려면 약관에 동의해주세요.</p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="border rounded-lg max-h-[180px] overflow-y-auto p-4 bg-gray-50 text-sm text-gray-700 mb-2">

                        <AgreeText path="/Agree/Agree1.txt" />
                    </div>

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                            checked={term1Checked}
                            onChange={() => setTerm1Checked(!term1Checked)}
                        />
                        <label className="ml-3 text-gray-800 text-base">VETERAN 동물병원 이용 약관 동의</label>
                    </div>

                    <div className="border rounded-lg max-h-[180px] overflow-y-auto p-4 bg-gray-50 text-sm text-gray-700 mb-2">
                        <AgreeText path="/Agree/Agree2.txt" />
                    </div>

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                            checked={term2Checked}
                            onChange={() => setTerm2Checked(!term2Checked)}
                        />
                        <label className="ml-3 text-gray-800 text-base">개인정보 수집 항목 동의</label>
                    </div>

                    <div className="border rounded-lg max-h-[180px] overflow-y-auto p-4 bg-gray-50 text-sm text-gray-700 mb-2">
                        <AgreeText path="/Agree/Agree3.txt" />
                    </div>

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                            checked={term3Checked}
                            onChange={() => setTerm3Checked(!term3Checked)}
                        />
                        <label className="ml-3 text-gray-800 text-base">개인정보 이용 목적 동의</label>
                    </div>

                    <div className="border rounded-lg max-h-[180px] overflow-y-auto p-4 bg-gray-50 text-sm text-gray-700 mb-2">
                        <AgreeText path="/Agree/Agree4.txt" />
                    </div>

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                            checked={term4Checked}
                            onChange={() => setTerm4Checked(!term4Checked)}
                        />
                        <label className="ml-3 text-gray-800 text-base">개인정보 보유 및 이용기간 동의</label>
                    </div>

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                            checked={termAllChecked}
                            onChange={handleAllAgree}
                        />
                        <label className="ml-3 text-gray-800 text-base">모두 동의</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium text-lg"
                        disabled={!term1Checked || !term2Checked || !term3Checked || !term4Checked}
                    >
                        동의하고 가입하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Agree;
