import styles from './Home.module.css';
import UserIcon from '../assets/UserIcon.png';
import AdminPanelIcon from '../assets/admin-panel.png';
import mainbg from '../assets/bgmain.jfif';

import { useState } from 'react';
import StoreAccountLogin from './StoreLogin.jsx';
import STOCLogin from './STOCLogin.jsx';

function Home(){

    const [isStoreAccountOpen, setIsStoreAccountOpen] = useState(false);
    const [isSTOCOpen, setIsSTOCOpen] = useState(false);

    const toggleStoreAccountModal = () => {
        setIsStoreAccountOpen(!isStoreAccountOpen);
    };

    const toggleSTOCModal = () => {
        setIsSTOCOpen(!isSTOCOpen);
    };

    return(
        <div className={styles.homeBg} style={{ backgroundImage: `url(${mainbg})` }}>
            <h1>ThirdVision</h1>

            <div className={styles.containerStyle}>
                <button onClick={() => setIsStoreAccountOpen(true)} className={styles.Storereg}>
                    <img className={styles.usericon} src={UserIcon} alt="User Icon" />
                    <p className={styles.pstyle}>STORE ACCOUNT</p>
                </button>

                <button onClick={() => setIsSTOCOpen(true)} className={styles.Storereg}>
                    <img className={styles.usericon} src={AdminPanelIcon} alt="Admin Icon" />
                    <p className={styles.pstyle}>POLICE ACCOUNT</p>
                </button>
            </div>

            {/* ✅ Store Account Modal */}
            {isStoreAccountOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <StoreAccountLogin onClose={() => setIsStoreAccountOpen(false)} />
                    </div>
                </div>
            )}

            {/* ✅ STOC Login Modal */}
            {isSTOCOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <STOCLogin onClose={() => setIsSTOCOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
    }

export default Home; 