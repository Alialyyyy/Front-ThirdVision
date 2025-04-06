import React, { useState, useEffect } from 'react';
import styles from './Stream.module.css';
import circle from '../../src/assets/circle.png';

function LiveStream({ storeID }) {  
    const [liveUrl, setLiveUrl] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        if (!storeID) return;  

        const fetchLiveUrl = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/live-stream/${storeID}`);
                const data = await response.json();

                if (response.ok) {
                    setLiveUrl(data.live_url);
                } else {
                    console.error("Live stream URL not found:", data.message);
                }
            } catch (error) {
                console.error("Error fetching live URL:", error);
            }
        };

        fetchLiveUrl();
    }, [storeID]); 

    useEffect(() => {
        const intervalId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(intervalId);
    }, []);
    function formatDate() {
        return new Date().toLocaleDateString();
    }
    function formatTime() {
        return new Date().toLocaleTimeString();
    }

    return (
        <div
            className={styles.Live}
            style={{
                backgroundImage: "var(--bg-dark)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className={styles.liveheader}>
                <p className={styles.plive}>{storeID} | LIVE</p>
                <img className={styles.IconCircle} src={circle} alt="Live Indicator" />
            </div>
            {liveUrl ? (
                <img src={liveUrl} style={{ width: '100%', height: 'auto' }} />
            ) : (
                <p style={{
                    color:"white",
                }}>Loading live stream...</p>
            )}
            
                <div className={styles.Footer}>
                <p className={styles.ptime}>{formatDate()} | {formatTime()}</p>
            </div>
        </div>
    );
}

export default LiveStream;
