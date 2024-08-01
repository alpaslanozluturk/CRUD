// ContentBox.tsx
import React from "react";
import Modal from "react-modal";
import './ContentBox.css';
import { GymRecord } from "../entities/GymRecord";

// Modal'ın erişim elemanını ayarlayın
Modal.setAppElement('#root');

interface ContentBoxProps {
    onSubmitDelete: (id: number) => void;
    onSubmitUpdate: (record: GymRecord) => void;
    content: GymRecord;
    onAddNewRecord?: () => void; // Opsiyonel olarak işaretleyin
}

const ContentBox: React.FC<ContentBoxProps> = ({ onSubmitDelete, onSubmitUpdate, content, onAddNewRecord }) => {
    const [record, setRecord] = React.useState<GymRecord>(content);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleSubmitDelete = () => {
        if (window.confirm("Egzersizi silmek istediğinizden emin misiniz?")) {
            onSubmitDelete(record.id);
        }
    };

    const handleSubmitUpdate = () => {
        onSubmitUpdate(record);
        setIsModalOpen(false);
    };

    return (
        <div className="content-box">
            <table className="content-box-table">
                <thead>
                    <tr>
                        <th>Egzersiz</th>
                        <th>Ağırlık (kg)</th>
                        <th>Tarih</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
            </table>
            <div className="content-box-body">
                <table className="content-box-table">
                    <tbody>
                        <tr>
                            <td>{record.exercise}</td>
                            <td>{record.weight}</td>
                            <td>{formatDate(record.date)}</td>
                            <td className="content-box-actions">
                                <button onClick={() => setIsModalOpen(true)}>Güncelle</button>
                                <button onClick={handleSubmitDelete}>Sil</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Egzersizi Güncelle"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '300px',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <h2>Egzersizi Güncelle</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitUpdate(); }}>
                    <input
                        type="text"
                        value={record.exercise}
                        onChange={(e) => setRecord({ ...record, exercise: e.target.value })}
                        placeholder="Egzersiz adı"
                    />
                    <input
                        type="number"
                        value={record.weight}
                        onChange={(e) => setRecord({ ...record, weight: parseInt(e.target.value, 10) })}
                        placeholder="Ağırlık (kg)"
                    />
                    <button type="submit">Kaydet</button>
                    <button type="button" onClick={() => setIsModalOpen(false)}>İptal</button>
                </form>
            </Modal>
        </div>
    );
};

export default ContentBox;
