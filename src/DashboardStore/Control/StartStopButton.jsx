import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import styles from "./control.module.css";
import WiFiStatus from "./WiFiSettings";

const StartStopButton = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState([]);
    const [status, setStatus] = useState("System Ready");
    const terminalRef = useRef(null);

    const { lastMessage } = useWebSocket("ws://localhost:5001", {
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (lastMessage !== null) {
            setOutput((prev) => [...prev, lastMessage.data]);

            setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [lastMessage]);

    const handleStart = async () => {
        setStatus("Starting script...");
        try {
            const res = await fetch("http://localhost:5001/start");
            if (res.ok) {
                setIsRunning(true);
                setStatus("Script is running...");
            } else {
                setStatus("Error: Failed to start script.");
            }
        } catch (error) {
            setStatus("Error: Could not connect to backend.");
        }
    };

    const handleStop = async () => {
        setStatus("Stopping script...");
        console.log("Stop request sent...");

        fetch("http://localhost:3001/stop").catch((error) => {
            console.error("Error stopping script:", error);
        });

        setTimeout(() => {
            setStatus("Refreshing...");
            window.location.href = window.location.href;
        }, 2000);
    };

    return (
        <div  className={styles.control}>
            <div>
                {/* ✅ Displays real-time status */}
                <button className={styles.button} onClick={handleStart} disabled={isRunning}>
                    START
                </button>
                <button className={styles.button} onClick={handleStop} disabled={!isRunning}>
                    STOP
                </button>
                <h2 className={styles.status}>{status}<WiFiStatus/></h2>
            </div>

            {/* ✅ Terminal Output */}
            <div className={styles.terminal}>
            <div ref={terminalRef}>
                <h3 className={styles.terminalTitle}>Terminal Output:</h3>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default StartStopButton;
