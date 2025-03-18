import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

interface PaymentDetail {
    paymentDetailsNum: number,
    cardNum: number,
    paymentTransactionId: string,
    paymentMerchant: string,
    paymentMethod: string,
    paymentState: string,
    paymentAmount: number,
    paymentAddress: string,
    paymentTransactionTime: string,
    paymentIp: string
}

const PaymentDetail: React.FC = () => {

    const userNum = useParams().userNum
    const [payment, setPayment] = useState<PaymentDetail[]>([]);

    const paymentBack = async () => {
        const response = await axios.get(`http://localhost:7124/back/api/paymentdetails/all/${userNum}`);
        setPayment(response.data);
    }

    useEffect(() => {
        paymentBack();
    }, [])

    return (
        <div>

            {payment.map((payment) => (
                <div key={payment.paymentDetailsNum}>
                    <p>{payment.paymentDetailsNum}</p>
                    <p>{payment.cardNum}</p>
                    <p>{payment.paymentTransactionId}</p>
                    <p>{payment.paymentMerchant}</p>
                    <p>{payment.paymentMethod}</p>
                    <p>{payment.paymentState}</p>
                    <p>{payment.paymentAmount}</p>
                    <p>{payment.paymentAddress}</p>
                    <p>{payment.paymentTransactionTime}</p>
                    <p>{payment.paymentIp}</p>
                </div>
            ))}
        </div>
    )
}

export default PaymentDetail