import React from 'react';
import styles from './About.module.css';

function About() {
    return (
        <div className={styles.aboutContainer}>
            <h1 className={styles.title}>What is ThirdVision?</h1>
            <h2 className={styles.divider}>_________________________________________________________</h2>
            
            <p className={styles.description}>
            In an era where security threats are evolving rapidly, 
            protecting public and commercial spaces has become a critical challenge. 
            <strong> ThirdVision</strong> is a state-of-the-art, real-time threat detection system designed 
            to enhance public safety. It leverages cutting-edge artificial intelligence (AI) 
            surveillance technology to proactively identify and address potential dangers 
            before they escalate.
            </p>
            
            <h3 className={styles.subtitle}>How Does It Work?</h3>
            <ul className={styles.featuresList}>
                <li><strong>Pose Detection</strong> – ThirdVision uses advanced pose analysis to detect potentially harmful situations.
                     By recognizing aggressor and victim stances, it can immediately identify threatening behavior.</li>
                <li><strong>Weapon Identification</strong> – Powered by the YOLOv8 AI model, the system can instantly recognize various types of weapons. 
                    This capability ensures swift identification and timely intervention.</li>
                <li><strong>Face Cover Detection</strong> – To enhance security, ThirdVision identifies individuals wearing masks or face coverings. 
                    This helps to raise alerts for individuals who may be attempting to conceal their 
                    identity.</li>
                <li><strong>Alert Notification</strong> – The system minimizes response time by sending instant notifications.
                 Alerts are delivered via text messages and pop-up notifications, ensuring that authorities are informed immediately.</li>
            </ul>

            <h3 className={styles.subtitle}>Why Choose ThirdVision?</h3>
            <p className={styles.description}>
            Traditional security systems often rely on passive monitoring, which can lead to delays, 
            human errors, and false positives. <strong>ThirdVision sets itself apart by providing a proactive,
             AI-driven solution</strong> that minimizes these risks. By identifying threats in real-time and 
             notifying the relevant authorities instantly,
             ThirdVision helps create a safer and more secure environment for everyone.
            </p>

            <h3 className={styles.subtitle}>Field Testing & Implementation</h3>
            <p className={styles.description}>
                ThirdVision is being tested in simulated retail environments, such as convenience stores, to assess its accuracy, response time, and reliability. 
                The ultimate goal is to deliver an <strong>affordable and efficient security solution </strong>that can be seamlessly implemented across public and commercial spaces,
                ensuring safety without compromising cost-effectiveness.
            </p>
        </div>
    );
}

export default About;
