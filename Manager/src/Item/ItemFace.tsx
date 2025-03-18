import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ItemFace = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [doorStatus, setDoorStatus] = useState("접근 할 수 없습니다.");
  const [isLoading, setIsLoading] = useState(false);
  const [targetImages, setTargetImages] = useState<string[]>([]);
  const [currentTargetImageIndex, setCurrentTargetImageIndex] = useState(0);
  const currentTargetImageIndexRef = useRef(0);

  const navigate = useNavigate();

  const loadImages = () => {
    const images = [
      "/images/김경민.jpg",
      "/images/김채린.png",
      "/images/김진헌.jpg",
      "/images/이정우.jpg",
    ];
    setTargetImages(images);
  };

  useEffect(() => {
    loadImages(); 
  }, []);

  useEffect(() => {
    console.log("targetImages 업데이트됨:", targetImages);
  }, [targetImages]);

  const startWebcam = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
        })
        .catch((err) => {
          console.error("웹캠 에러:", err);
          toast.error("웹캠 에러.");
        });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isStreaming) {
      startWebcam();

      timer = setTimeout(() => {
        alert("접근할 수 없습니다.");
        window.location.reload();
      }, 15000);

      const interval = setInterval(captureAndSendFrame, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
      };
    }
  }, [isStreaming]);

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  const urlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current || targetImages.length === 0) return;

    const context = canvasRef.current.getContext("2d");

    if (context) {
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      
      for (let i = 0; i < targetImages.length; i++) {
        const formData = new FormData();
        formData.append("source_image", dataURItoBlob(imageData), "face.jpg");
        const targetImage = targetImages[i];
        const targetBlob = await urlToBlob(targetImage);
        formData.append("target_image", targetBlob, `target${i}.jpg`);

        console.log("전송할 targetImage:", targetImage); 
        console.log("formData:", formData.getAll("target_image"));

        setIsLoading(true);

        try {
          const response = await axios.post(
            "http://localhost:7124/back/api/compreface", 
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
              timeout: 10000,
            }
          );            
          
          if(response.status === 200) {
            alert(response.data);
            navigate("/item/list")
            break;
          }  

        } catch (error: any) {
          console.log("API 요청 오류:", error.response.data);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">정면을 봐주세요</h1>
      <video
        ref={videoRef}
        autoPlay
        className="mt-4 w-200 h-200 border-2 border-gray-300"
      />
      <canvas ref={canvasRef} width="800" height="800" hidden />
      {!isStreaming ? (
        <button
          onClick={() => setIsStreaming(true)}
          disabled={isLoading}
          className="mt-4 px-6 py-2 bg-green-500 rounded hover:bg-green-600 transition"
        >
          {isLoading ? "로딩 중..." : "웹캠 시작"}
        </button>
      ) : (
        <button
          onClick={() => setIsStreaming(false)}
          className="mt-4 px-6 py-2 bg-red-500 rounded hover:bg-red-600 transition"
        >
          웹캠 종료
        </button>
      )}
      <p className="mt-4 text-lg">{doorStatus}</p>
    </div>
  );
};

export default ItemFace;
