import React from 'react';
import styles from './Founders.module.css';

function Founders() {
    return (
        <div className={styles.foundersContainer}>
            <h1 className={styles.title}>Meet the Founders</h1>
            <h2 className={styles.divider}>______________________</h2>

            <p className={styles.intro}>
                <strong>ThirdVision</strong> is the brainchild of three dedicated Computer Engineering students from Colegio De Muntinlupa.  
                Their goal: To build an AI-driven real-time threat detection system that enhances security using cutting-edge technology.
            </p>

            {/* ✅ Grid Layout for Founders */}
            <div className={styles.foundersGrid}>
                <div className={styles.founder}>
                    <h3 className={styles.name}>Alyssa Frago</h3>
                    <p className={styles.bio}>
                        <strong>Role:</strong> Web Developer<br />
                        Developed and integrated the entire website, ensuring a seamless user experience.
                    </p>
                    <ul className={styles.tasks}>
                        <li>💻 Frontend Development – Designing a modern UI/UX with React.js + Vite.</li>
                        <li>🖥️ Backend API – Creating secure Node.js & Express.js APIs.</li>
                        <li>🛢️ Database Management – Using MySQL for data storage & retrieval.</li>
                    </ul>
                </div>

                <div className={styles.founder}>
                    <h3 className={styles.name}>Janel Lariba</h3>
                    <p className={styles.bio}>
                        <strong>Role:</strong> AI Model Trainer & Optimization Expert<br />
                        Trained and improved the AI models, ensuring high accuracy & precision.
                    </p>
                    <ul className={styles.tasks}>
                        <li>🤖 Training AI Models – Using YOLOv8 for weapon & pose detection.</li>
                        <li>📈 Performance Optimization – Enhancing accuracy & precision.</li>
                        <li>📊 Data Collection & Preprocessing – Building robust training datasets.</li>
                    </ul>
                </div>

                <div className={styles.founder}>
                    <h3 className={styles.name}>Alessandra Remo</h3>
                    <p className={styles.bio}>
                        <strong>Role:</strong> Raspberry Pi Specialist & AI Trainer<br />
                        Alessandra is responsible for configured the Raspberry Pi and trained models.
                    </p>
                    <ul className={styles.tasks}>
                        <li>🔧 Raspberry Pi Setup – Configuring hardware & software integration.</li>
                        <li>🖥️ Edge AI Optimization – Running AI models efficiently on Raspberry Pi.</li>
                        <li>🔬 Hardware & Sensor Calibration – Ensuring metal detector accuracy.</li>
                    </ul>
                </div>
            </div>

            {/* ✅ Team Dedication Section */}
            <h3 className={styles.subtitle}>A Project Built with Dedication</h3>
            <p className={styles.description}>
                ThirdVision was developed through hard work, research, and passion.  
                The founders aimed to build a real-time AI-powered security system that minimizes false alarms, detects aggressor behavior, and provides instant alerts to authorities.
            </p>
        </div>
    );
}

export default Founders;
