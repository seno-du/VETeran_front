import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

const VitalsChart = () => {
    const data = [
        {date: '01-16', heartRate: 120, temperature: 38.5, respiration: 22},
        {date: '01-17', heartRate: 115, temperature: 38.2, respiration: 20},
        {date: '01-18', heartRate: 118, temperature: 38.7, respiration: 24},
        {date: '01-19', heartRate: 122, temperature: 38.9, respiration: 25},
        {date: '01-20', heartRate: 116, temperature: 38.4, respiration: 21},
        {date: '01-21', heartRate: 114, temperature: 38.1, respiration: 19},
        {date: '01-22', heartRate: 119, temperature: 38.6, respiration: 23},
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date" fontSize={11}/>
                <YAxis fontSize={11}/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36}/>
                <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#ef4444"
                    name="심박수(bpm)"
                    dot={false}
                />
                <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#0ea5e9"
                    name="체온(°C)"
                    dot={false}
                />
                <Line
                    type="monotone"
                    dataKey="respiration"
                    stroke="#22c55e"
                    name="호흡수(/min)"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default VitalsChart