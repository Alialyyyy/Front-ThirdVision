import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function ReportLineGraph({ storeID }) {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        if (!storeID) return;

        const fetchReportData = async () => {
            try {
                console.log(`Fetching report count for Store ID: ${storeID}`);
                const response = await fetch(`http://localhost:5001/api/report-count-per-month/${storeID}`);
        
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText}`);
                }
        
                const data = await response.json();
                console.log("✅ Report Data Received:", data);
                setReportData(data);
            } catch (error) {
                console.error("❌ Error fetching report count data:", error);
            }
        };             

        fetchReportData();
    }, [storeID]);

    return (
        <div style={{ width: "100%", height: 300 }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>📈 Report Count Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Total Reports", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#ff7300" strokeWidth={3} dot={{ fill: "#ff7300", r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ReportLineGraph;
