import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { usePatientStore } from "../../zustand/Patient.ts";


const BASE_URL = "http://localhost:8000/wado-rs";

const Objective: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // 여러 파일을 저장할 상태
    const [message, setMessage] = useState<string>("");
    const { patientId, setPatientId } = usePatientStore();

    // 테스트용
    useEffect(() => {
        setPatientId(2); // test용으로 patientId 설정
    }, [setPatientId]);

    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files)); // 여러 파일을 배열로 저장
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessage("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append("files", file);
        });
        if (patientId) {
            formData.append("patient_id", patientId.toString());
        } else {
            alert("환자 번호가 인식되지 않습니다.");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/studies`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("파일 업로드 성공: " + response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const errorMessage = axiosError.response.data as string;
                setMessage("파일 업로드 실패: " + errorMessage);
            } else {
                setMessage("파일 업로드 실패: 네트워크 오류 또는 서버 문제");
            }
        }
    };

    const handleDownloadClick = async () => {
        const type = window.prompt("DICOM 파일을 다운로드 하려면 DICOM, PNG로 다운받으시려면 PNG를 입력해주세요")

        if(!type && type !== "DICOM" && type !== "PNG") {
            alert("취소되었습니다")
            return;
        }

        const study = "1.2.156.14702.1.1000.16.0.20200311113603875"
        const series = "1.2.156.14702.1.1000.16.1.2020031111365290600020002"
        let downloadurl = `${BASE_URL}/studies/${study}/series/${series}`

        if(type === "PNG") {
            downloadurl += "/frames"
        }

        try {
            console.log(downloadurl)
            const response = await axios.get(downloadurl, {
                responseType: "blob", // 파일로 응답을 받기 위한 설정
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${"Test"}.${type == "DICOM" ? "zip" : "zip"}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            alert("파일 다운로드 실패")
        }
    }

    const handleDICOMViewer = async () => {
        const study = "1.2.156.14702.1.1000.16.0.20200311113603875"
        const series = "1.2.156.14702.1.1000.16.1.2020031111365290600020002"
        const url = btoa(`${BASE_URL}/studies/${study}/series/${series}`)
        window.open("/PACS/test/" + url, "_blank")
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                <span className="mr-1 text-teal-600">◢</span> Objective
            </h3>
            <div className="h-32 overflow-auto border border-gray-200 rounded">
                <ul className="divide-y divide-gray-100">
                    {["수술", "호르몬", "방사선", "초음파", "CT", "MRI"].map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center p-2 text-sm transition-colors cursor-pointer hover:bg-gray-50"
                        >
                            <span className="mr-2 text-gray-400">📄</span>
                            <span className="text-gray-700" onClick={handleDICOMViewer}>{item}</span>
                            <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={handleDownloadClick}>다운로드</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 파일 업로드 섹션 */}
            <div className="mt-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="p-2 border rounded-md max-w-52"
                    multiple
                />
                <button
                    onClick={handleUpload}
                    disabled={!selectedFiles}
                    className="p-2 ml-4 text-white bg-teal-600 rounded-md disabled:bg-gray-400"
                >
                    업로드
                </button>
                {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
            </div>
        </div>
    );
};

export default Objective;
