import styles from './DashboardStore.module.css';
import { useNavigate } from 'react-router-dom';
import LiveStream from './LiveStream.jsx';
import Status from './Status.jsx';
import { useState, useEffect } from 'react';
import IncidentHistory from './IncidentHistory.jsx';
import DeletedHistory from './DeletedHistory.jsx';
import EditHistory from './EditHistory.jsx';
import Sidebar from './Sidebar/Sidebar.jsx';

function DashboardStore() {
    const [activePanel, setActivePanel] = useState(null);
    const [storeID, setStoreID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedStoreID = localStorage.getItem('store_ID'); 
        if (storedStoreID) {
            setStoreID(storedStoreID);
        } else {
            console.error('No store ID found in local storage');
            navigate('/'); 
        }
    }, [navigate]); 
    
    return (
        <div className={styles.MainBg}>
            {/* Sidebar */}
            <Sidebar setActivePanel={setActivePanel}  storeID={storeID}/>

            {/* Dashboard Content */}
            <div className={styles.dashboardContent}>
            {activePanel === "IncidentHistory" && <IncidentHistory storeID={storeID} closePanel={() => setActivePanel(null)} /> }
            {activePanel === "EditHistory" && <EditHistory storeID={storeID} onClose={() => setActivePanel(null)} isOpen={activePanel === "EditHistory"} />}
            {activePanel === "DeletedHistory" && <DeletedHistory storeID={storeID} closePanel={() => setActivePanel(null)} />}

                {/* Always Visible on Dashboard */}
            <div>
                <div className={styles.dashboardContainer}>
                    <LiveStream storeID={storeID} />
                    <Status storeID={storeID} />
                </div>
            </div>
        </div>
        </div>
    );
}

export default DashboardStore;
