import React, { useState, useEffect } from 'react';
import ConnectDBModal from './ConnectDBModal';
import { useSelector } from 'react-redux';
import { getDbList } from '../api';
const DBListScreen = ({ onSelectDb }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [databases, setDatabases] = useState([]);
    const user = useSelector((state) => state.user);


    useEffect(() => {
        const load = async () => {
            await fetchDbList();
        };
        load();
    }, []);

    const handleConnectClick = () => {
        setIsModalOpen(true);
    };

    const fetchDbList = async () => {
        const res = await getDbList(user.id);
        if (res && res.Databases) {
            setDatabases(res.Databases.map(db => ({
                name: db.database_name,
                id: db.database_id,
                role: db.UserDatabaseRoles.role 
            })));
        }
    }

    const handleDbConnected = (newDb) => {
        setDatabases([...databases, newDb]);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Connected Databases</h2>
                <button onClick={handleConnectClick}>Connect DB</button>
            </div>
            {databases.length === 0 ? (
                <p>No databases connected. Click "Connect DB" to get started.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {databases.map((db, index) => (
                        <li key={index} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', cursor: 'pointer' }} onClick={onSelectDb}>
                            {db.name}
                        </li>
                    ))}
                </ul>
            )}
            {isModalOpen && <ConnectDBModal onClose={() => setIsModalOpen(false)} onDbConnected={handleDbConnected} />}
        </div>
    );
};

export default DBListScreen;