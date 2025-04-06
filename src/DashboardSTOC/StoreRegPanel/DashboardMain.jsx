import { useState } from "react";
import Sidebar from "../SidebarMenu/Sidebar.jsx";
import StoreregPanel from "../StoreRegPanel/StoreregPanel.jsx";
import IncidentReportPanel from "../IncidentReportPanel/IncidentReportPanel.jsx";
import RegisterStorePanel from "../RegisterStorePanel/RegisterStorePanel.jsx";
import DeleteHistory from "../IncidentReportPanel/DeleteHistory.jsx";
import PoliceRegPanel from "../PoliceReg/PoliceRegistration.jsx";
import Notification from "../NotifAlert/Notification.jsx";
import RepCountPanel from "../RepCountPanel/RepCountPanel.jsx";
import PopUpNotif from "../NotifAlert/PopupNotif.jsx";
import styles from "./DashboardMain.module.css";
import PoliceAccs from "../RegisterStorePanel/PoliceStorePanel.jsx";

function Dashboard() {
    const [activePanel, setActivePanel] = useState(null);
    const [latestReports, setLatestReports] = useState([]);

    return (
        <div className={styles.MainBg}>
            {/* Sidebar */}
            <Sidebar setActivePanel={setActivePanel} />

            {/* Dashboard Content */}
            <div className={styles.dashboardContent}>
                {/* Display selected sidebar panel */}
                {activePanel === "StoreRegPanel" && <StoreregPanel closePanel={() => setActivePanel(null)}/>}
                {activePanel === "IncidentReportPanel" && (<IncidentReportPanel closePanel={() => setActivePanel(null)} />)}
                {activePanel === "RegisterStorePanel" && (<RegisterStorePanel closePanel={() => setActivePanel(null)} />)}                
                {activePanel === "DeleteHistory" && (<DeleteHistory closePanel={() => setActivePanel(null)} />)}
                {activePanel === "PoliceRegistration" && (<PoliceRegPanel closePanel={() => setActivePanel(null)} />)}
                {activePanel === "PoliceStorePanel" && (<PoliceAccs closePanel={() => setActivePanel(null)} />)}                                       
                
            {/* Always Visible on Dashboard */}
            <div>
                <div className={styles.panel1}>
                    <RepCountPanel />
                </div>
                <div className={styles.panel2}>
                    <PopUpNotif latestReports={latestReports}/>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Dashboard;
