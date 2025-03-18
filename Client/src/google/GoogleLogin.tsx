import React, { useEffect, useState } from 'react'
import axios from 'axios';

const GoogleLogin: React.FC = () => {


    const [url, setUrl] = useState('')

    const handleGoogleLogin = async () => {

        await axios.post('http://localhost:7124/back/api/login/google')
            .then(response => setUrl(response.data))
            .catch(error => console.log(error));

    }
    useEffect(() => {
        if (url) {
            window.location.href = url;
        }
        handleGoogleLogin();
    }, [url])

    return null;
}

export default GoogleLogin