import React from "react";
import {useParams} from "react-router-dom";

const DicomViewer: React.FC = () => {
    const base64_url = useParams().url;

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            <iframe src={"http://localhost:3000?url="+base64_url} className="flex-grow w-full"></iframe>
        </div>

    )
}

export default DicomViewer