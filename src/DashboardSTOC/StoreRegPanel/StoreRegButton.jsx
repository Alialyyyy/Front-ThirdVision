import { useState } from "react";
import AccountRegistrationPanel from './Storeregister.jsx';
import styles from './StoreRegButton.module.css';


function StoreRegButton(){
    
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };
  
    return(
    <div>
        <button className={styles.storebtn} onClick={togglePanel}>
        REGISTER</button>
        {isPanelOpen && <AccountRegistrationPanel/>}
    </div>
    );
}

export default StoreRegButton;