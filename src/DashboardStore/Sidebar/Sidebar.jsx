import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

import bin from "../../assets/bin.png";
import report from "../../assets/report.png";
import logoutIcon from "../../assets/logoutIcon.png";

function Sidebar({ setActivePanel, storeID }) {
    const [isOpen, setIsOpen] = useState(true);
    const [storeName, setStoreName] = useState(""); // 👈 to hold the name
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStoreName = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/store-accounts");
                if (!response.ok) throw new Error("Failed to fetch store accounts.");

                const data = await response.json();
                // Find the store name by storeID
                const store = data.find(store => store.store_ID.toString() === storeID.toString());

                if (store) {
                    setStoreName(store.store_name);
                } else {
                    setStoreName(`Store ${storeID}`); // Fallback if not found
                }
            } catch (error) {
                console.error("Error fetching store name:", error);
                setStoreName(`Store ${storeID}`); // Fallback in case of error
            }
        };

        if (storeID) fetchStoreName();
    }, [storeID]);

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <>
            {/* ✅ Toggle Button Showing Store Name */}
            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                ☰ <span>{isOpen ? storeName : ""}</span>
            </button>

            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.menu}>
                    <img src={report} className={styles.logo} alt="Logo" />
                    <h3 className={styles.title2}>THIRDVISION</h3>

                    <button onClick={() => setActivePanel("IncidentHistory")}>
                        <img src={report} className={styles.icon} alt="Incident History" /> Incident History
                    </button>

                    <button onClick={() => setActivePanel("EditHistory")}>
                        <img src={report} className={styles.icon} alt="Edited Reports" /> Edited Reports
                    </button>

                    <button onClick={() => setActivePanel("DeletedHistory")}>
                        <img src={bin} className={styles.icon} alt="Trash" /> Trash
                    </button>

                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <img src={logoutIcon} className={styles.icon} alt="Logout" /> Logout
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
