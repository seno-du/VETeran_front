import React, { useRef, useEffect, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import { useParams } from 'react-router-dom';

const DicomViewer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const base64_url = useParams().url;
    const [url, setUrl] = useState<string | null>(null);
    const [images, setImages] = useState<any[]>([]);  // 여러 이미지를 저장할 배열
    const [currentIndex, setCurrentIndex] = useState<number>(0);  // 현재 표시된 이미지 인덱스

    // URL을 base64에서 디코딩하여 상태에 설정
    useEffect(() => {
        if (base64_url) {
            setUrl(atob(base64_url));
        } else {
            alert('유효하지 않은 접근입니다');
        }
    }, []);

    // DICOM 파일을 로드하고 이미지 데이터를 처리하는 함수
    useEffect(() => {
        if (url) {
            setLoading(true);
            cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
            cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

            const element = canvasRef.current;

            if (element) {
                cornerstone.enable(element);

                const imageId = `wadouri:${url}`;
                cornerstone.loadImage(imageId).then(image => {
                    console.log("이미지 데이터:", image);

                    if (image && image.data) {
                        // 여러 프레임을 가진 DICOM 파일인지 확인
                        if (image.data.int16Array && image.data.int16Array.length > 0) {
                            const loadedImages = [];
                            const numFrames = image.data.int16Array.length;
                            console.log(`프레임 수: ${numFrames}`);
                            for (let i = 0; i < numFrames; i++) {
                                loadedImages.push(image);  // 여러 프레임을 저장
                            }
                            setImages(loadedImages);
                        } else {
                            // 단일 프레임일 경우 바로 렌더링
                            cornerstone.displayImage(element, image);
                        }
                    } else {
                        setError("DICOM 이미지에 유효한 데이터가 없습니다.");
                        setLoading(false);
                    }
                }).catch(err => {
                    setError(`DICOM 이미지 로딩 오류: ${err.message}`);
                    setLoading(false);
                });
            }
        }
    }, [url]);

    // 이미지 프레임을 캔버스에 표시
    useEffect(() => {
        if (images.length > 0) {
            const element = canvasRef.current;
            if (element) {
                const image = images[currentIndex];
                cornerstone.displayImage(element, image);
            }
        }
    }, [images, currentIndex]);

    // 다음 이미지로 이동
    const nextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);  // 다음 프레임으로 이동
        }
    };

    // 이전 이미지로 이동
    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);  // 이전 프레임으로 이동
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div
                ref={canvasRef}
                style={{ width: '100%', height: '100vh' }}
            ></div>
            <div className="flex justify-between mt-4">
                <button onClick={prevImage} disabled={currentIndex === 0}>
                    이전
                </button>
                <button onClick={nextImage} disabled={currentIndex === images.length - 1}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default DicomViewer;
