import { useState, useEffect, useRef } from 'react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import EditIncidentPanel from './EditPanel.jsx';
import IR from './IncidentHistory.module.css';
import { FaEye } from 'react-icons/fa';
import ThreatDropdown from './ThreatDropdown.jsx';
import TypeDropdown from './TypeDropdown.jsx';
import dropdown from './Dropdown.module.css';

function IncidentHistory({ closePanel, storeID }) {
    const [time, setTime] = useState(new Date());
    const [history, setHistory] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [search, setSearch] = useState(''); 
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [selectedThreatLevel, setSelectedThreatlevel] = useState([]); 
    const [selectedType, setSelectedType] = useState([]); 
    const tableRef = useRef(null);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date()); 
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!storeID) return;

        setLoading(true);
        fetch(`http://localhost:5001/api/incident-history/${storeID}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched incident history:', data);
                setHistory(data); 
                onHistoryUpdate(data.length); 
            })
            .catch(error => console.error('Error fetching incident history:', error))
            .finally(() => setLoading(false));
    }, [storeID, selectedThreatLevel, selectedType]); 

    const fetchIncidentHistory = async () => {
        setLoading(true);
        
        const queryParams = new URLSearchParams();
    
        if (selectedLocations.length > 0) {
            queryParams.append("searchLocations", selectedLocations.join(","));
        }
        if (selectedThreatLevel.length > 0) {
            queryParams.append("searchThreatLevels", selectedThreatLevel.join(","));
        }
        if (selectedType.length > 0) {
            queryParams.append("searchType", selectedType.join(","));
        }
    
        const queryString = queryParams.toString();
        const url = `http://localhost:5001/api/incident-history${queryString ? `?${queryString}` : ""}`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
        };

        
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleDelete = async (shared_detection_id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
    
        try {
            const response = await fetch(`http://localhost:5001/api/delete-detection-store/${shared_detection_id}`, {
                method: "DELETE",
            });
    
            if (!response.ok) throw new Error("Failed to delete record");
    
            fetchIncidentHistory();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };
    
    const handleButtonClick = (event, image) => {
        event.preventDefault();
        let newUrl = image;

        if (image.includes('drive.google.com')) {
            newUrl = image.replace('drive.google.com', 'yourdomain.com');
        }

        window.open(newUrl, '_blank', 'noopener,noreferrer'); 
    };

    const handleEditClick = (incident) => {
        setSelectedIncident(incident); 
    };

    const handleSaveEdit = async (updatedIncident) => {
        try {
            const response = await fetch(`http://localhost:5001/api/edit-incident/${updatedIncident.detection_ID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedIncident),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to edit incident");
            }
    
            console.log("✅ Incident updated successfully in the backend!");
    
            setHistory((prevHistory) =>
                prevHistory.map((item) =>
                    item.detection_ID === updatedIncident.detection_ID ? updatedIncident : item
                )
            );
    
            setSelectedIncident(null);
        } catch (error) {
            console.error("❌ Error updating incident:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const second = parseInt(seconds, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second} ${ampm}`;
    };
    

    const filteredHistory = history.filter((entry) => {
        const detectionIdStr = String(entry.detection_ID);
        const sharedIdStr = String(entry.shared_detection_id);
        const dateStr = entry.date;
        const timeStr = entry.time;
        const threatLevelStr = String(entry.threat_level).toLowerCase();
        const typeStr = String(entry.detection_type).toLowerCase();
    
        if (threatLevelStr === 'low') return false; 
    
        const matchesSearch = search.toLowerCase() === '' || (
            detectionIdStr.includes(search) ||
            sharedIdStr.includes(search) ||
            formatDate(dateStr).includes(search) ||
            formatTime(timeStr).includes(search) ||
            threatLevelStr.includes(search) ||
            typeStr.includes(search)
        );
    
        const matchesThreatLevel = selectedThreatLevel.length === 0 || selectedThreatLevel.includes(entry.threat_level);
        const matchesType = selectedType.length === 0 || selectedType.includes(entry.detection_type);
    
        return matchesSearch && matchesThreatLevel && matchesType;
    });    

    const exportToExcel = () => {
        if (!tableRef.current) {
            alert("No data to export.");
            return;
        }

        const ws = XLSX.utils.table_to_sheet(tableRef.current);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Incident History");

        Object.keys(ws).forEach((key) => {
            if (ws[key].v && ws[key].v.toString().match(/^\d+$/)) {
                ws[key].z = "0";
            }
        });

        // ✅ Adjust column widths
        ws['!cols'] = [
            { wch: 10 }, // ID
            { wch: 12 }, // Date
            { wch: 12 }, // Time
            { wch: 25 }, // Threat Level
            { wch: 15 }  // Type
        ];

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const currentDate = new Date().toISOString().split("T")[0];
        saveAs(fileData, `Incident_Report_${currentDate}.xlsx`);
    };

    return (
        <div className={IR.floatingPanel}>
            <button className={IR.closeButton} onClick={closePanel}>✖</button>
            <h2 className={IR.title}>Incident History</h2>
            <div className={IR.searchContainer}>            
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    className={IR.searchInput} 
                />
                <button className={IR.exportButton} onClick={exportToExcel} >
                 📤 Export to Excel
                </button>
            </div>
            <div className={dropdown.dropdownContainer}>
                <ThreatDropdown onSelect={setSelectedThreatlevel}/>
                <TypeDropdown onSelect={setSelectedType}/>
            </div>
            {loading ? (
                <p className={IR.loading}>Loading... {time.toLocaleTimeString()}</p>
            ) : (
                <div  className={IR.tableContainer}>
                    <table className={IR.table} ref={tableRef}> 
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Threat Level</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                filteredHistory.slice().reverse().map((entry) => (
                                    <tr key={entry.shared_detection_id}>
                                        <td>{entry.shared_detection_id}</td>
                                        <td>
                                            <button className={IR.eyeButton} onClick={(event) => handleButtonClick(event, entry.image)}>
                                                <FaEye size={18} />
                                            </button>
                                        </td>
                                        <td>{formatDate(entry.date)}</td>
                                        <td>{formatTime(entry.time)}</td>
                                        <td>{entry.threat_level}</td>
                                        <td>{entry.detection_type}</td>
                                        <td>
                                            <button className={IR.editButton} onClick={() => handleEditClick(entry)}>Edit</button>
                                            <button className={IR.deleteButton} onClick={() => handleDelete(entry.detection_ID)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedIncident && (
                <EditIncidentPanel
                    incident={selectedIncident}
                    onClose={() => setSelectedIncident(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}

export default IncidentHistory;