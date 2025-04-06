import { useState } from 'react';
import styles from './AdminPasswordPanel.module.css';

function AdminVerify({ closePanel, onSuccess }) { 
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(null); 

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5001/api/verify-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setStatus('Success!');
    
                setTimeout(() => {
                    closePanel(); 
                    onSuccess();  
                }, 2000);
            } else {
                setStatus(data.message || 'Oops! Wrong password');
            }
        } catch (error) {
            setStatus('Error');
        }
    };

    return (
        <div>
            <div className={styles.floatingPanel}>
                <button className={styles.closeButton} onClick={closePanel}>&times;</button>
                <h1 className={styles.title}>Admin Password Verification</h1>
                
                <form className={styles.form} onSubmit={handleLogin}>
                    <label className={styles.label}>
                        <input
                            type= "password"
                            className={styles.input}
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" className={styles.submitButton}>Verify</button>
                </form>

                {status === 'success' && <p className={styles.successMessage}>✅ Account saved! Registering...</p>}
                {status === 'error' && <p className={styles.errorMessage}>❌ Incorrect admin password. Try again.</p>}
            </div>
        </div>
    );
}

export default AdminVerify;
