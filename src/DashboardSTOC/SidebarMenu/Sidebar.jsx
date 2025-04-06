import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

import add from "../../assets/add.png";
import report from "../../assets/report.png" 
import registered from "../../assets/customer.png";
import bin from "../../assets/bin.png";
import addAdmin from "../../assets/addAdmin.png";
import policeBadge from "../../assets/policeBadge.png";
import logoutIcon from "../../assets/logoutIcon.png";

function Sidebar({ setActivePanel }) {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/"); 
    };

    return (
        <>
            {/* Sidebar Toggle Button (Fixed) */}
            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                ☰ <span>ThirdVision</span>
            </button>

            {/* Sidebar Panel */}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.menu}>
                    <img src={policeBadge} className={styles.logo} />
                    <h3 className={styles.title2}>POLICE STATION</h3>

                    <button onClick={() => setActivePanel("IncidentReportPanel")}>
                        <img src={report} className={styles.icon} /> Incident Reports
                    </button>
                    <button onClick={() => setActivePanel("PoliceRegistration")}>
                        <img src={addAdmin} className={styles.icon} /> Police Registration
                    </button>
                    <button onClick={() => setActivePanel("StoreRegPanel")}>
                        <img src={add} className={styles.icon} /> Store Registration
                    </button>
                    <button onClick={() => setActivePanel("RegisterStorePanel")}>
                        <img src={registered} className={styles.icon} /> Verified Stores
                    </button>
                    <button onClick={() => setActivePanel("PoliceStorePanel")}>
                        <img src={report} className={styles.icon} /> Authorized Police Users
                    </button>
                    <button onClick={() => setActivePanel("DeleteHistory")}>
                        <img src={bin} className={styles.icon} /> Delete History
                    </button>

                    {/* Logout Button */}
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <img src={logoutIcon} className={styles.icon} /> Logout
                    </button>
                </div>
            </div>
        </>
    );
}    

export default Sidebar;
