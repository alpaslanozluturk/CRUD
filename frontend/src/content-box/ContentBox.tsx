import React, { useState } from "react";
import Modal from "react-modal";
import './ContentBox.css';
import { GymRecord } from "../entities/GymRecord";
import Pagination from "../pagination/Pagination";
import Search from "../search/Search";

// Modal'ın erişim elemanını ayarlayın
Modal.setAppElement('#root');

interface ContentBoxProps {
    onSubmitDelete: (id: number) => void;
    onSubmitUpdate: (record: GymRecord) => void;
    onCreateRecord: (exercise: string, weight: number) => Promise<GymRecord>;
    onSearch: (query: string, page: number, rowsPerPage: number) => Promise<{ results: GymRecord[], totalPages: number }>;
    content: GymRecord[];
    onAddNewRecord?: () => void;
    currentPage: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
    setRecords: React.Dispatch<React.SetStateAction<GymRecord[]>>;
    records: GymRecord[];
    onCloseSearchModal: () => void;
}

const ContentBox: React.FC<ContentBoxProps> = ({
    onSubmitDelete,
    onSubmitUpdate,
    onCreateRecord,
    onSearch,
    content,
    onAddNewRecord,
    currentPage,
    rowsPerPage,
    onPageChange,
    totalPages,
    setRecords,
    records,
    onCloseSearchModal
}) => {
    const [record, setRecord] = useState<GymRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExercise, setNewExercise] = useState('');
    const [newWeight, setNewWeight] = useState(0);
    const [searchResults, setSearchResults] = useState<GymRecord[]>([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchCurrentPage, setSearchCurrentPage] = useState(1);
    const [searchTotalPages, setSearchTotalPages] = useState(1);
    const searchRowsPerPage = 10;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleSubmitDelete = (id: number) => {
        if (window.confirm("Egzersizi silmek istediğinizden emin misiniz?")) {
            onSubmitDelete(id);
        }
    };

    const handleSubmitUpdate = () => {
        if (record) {
            onSubmitUpdate(record);
            setIsModalOpen(false);
        }
    };

    const handleSearch = async (query: string, page: number, rowsPerPage: number): Promise<{ results: GymRecord[], totalPages: number }> => {
        try {
            const data = await onSearch(query, page, rowsPerPage);
            setSearchResults(data.results);
            setSearchTotalPages(data.totalPages);
            setSearchCurrentPage(page);
            setIsSearchModalOpen(true);
            return data;
        } catch (error) {
            console.error("Error during search:", error);
            return { results: [], totalPages: 0 };
        }
    };

    const handleSearchPageChange = async (page: number) => {
        try {
            const query = searchResults.length > 0 ? searchResults[0].exercise : "";
            const data = await onSearch(query, page, searchRowsPerPage);
            setSearchResults(data.results);
            setSearchCurrentPage(page);
        } catch (error) {
            console.error("Error during search page change:", error);
        }
    };

    const handleCreateSubmit = async () => {
        try {
            const newRecord = await onCreateRecord(newExercise, newWeight);
            setRecords([...records, newRecord]);
            setIsModalOpen(false);
            setNewExercise('');
            setNewWeight(0);
        } catch (error) {
            console.error("Error creating record:", error);
        }
    };

    const handleCloseSearchModal = () => {
        setIsSearchModalOpen(false);
        setSearchResults([]);
        onCloseSearchModal();
    };

    return (
        <div className="content-box">
            <button className="add-new-record-button" onClick={onAddNewRecord}>
                Yeni Kayıt Ekle
            </button>
            <div className="search-container">
                <Search onSearch={handleSearch} />
            </div>
            <div className="content-box-body">
                <table className="content-box-table">
                    <thead>
                        <tr>
                            <th>No:</th>
                            <th>Egzersiz</th>
                            <th>Ağırlık (kg)</th>
                            <th>Tarih</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.length > 0 ? (
                            content.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                    <td>{record.exercise}</td>
                                    <td>{record.weight}</td>
                                    <td>{formatDate(record.date.toString())}</td>
                                    <td className="content-box-actions">
                                        <button onClick={() => { setRecord(record); setIsModalOpen(true); }}>Güncelle</button>
                                        <button onClick={() => handleSubmitDelete(record.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>Veri bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>

            <Modal
                isOpen={isSearchModalOpen}
                onRequestClose={handleCloseSearchModal}
                contentLabel="Arama Sonuçları"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        maxHeight: '80vh',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        overflowY: 'auto'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <h2>Arama Sonuçları</h2>
                {searchResults.length > 0 ? (
                    <table className="content-box-table">
                        <thead>
                            <tr>
                                <th>No:</th>
                                <th>Egzersiz</th>
                                <th>Ağırlık (kg)</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{(searchCurrentPage - 1) * searchRowsPerPage + index + 1}</td>
                                    <td>{record.exercise}</td>
                                    <td>{record.weight}</td>
                                    <td>{formatDate(record.date.toString())}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Arama kriterlerine uygun sonuç bulunamadı.</p>
                )}
                <Pagination
                    currentPage={searchCurrentPage}
                    totalPages={searchTotalPages}
                    onPageChange={handleSearchPageChange}
                />
                <button className="close-button" onClick={handleCloseSearchModal}>Kapat</button>
            </Modal>

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
                        height: '150px',
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
                {record && (
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitUpdate(); }}>
                        <input
                            type="text"
                            value={record.exercise}
                            onChange={(e) => setRecord({ ...record, exercise: e.target.value } as GymRecord)}
                            placeholder="Egzersiz adı"
                        />
                        <input
                            type="number"
                            value={record.weight}
                            onChange={(e) => setRecord({ ...record, weight: parseInt(e.target.value, 10) } as GymRecord)}
                            placeholder="Ağırlık (kg)"
                        />
                        <div className="modal-form-buttons">
                            <button type="submit" className="save-button">Kaydet</button>
                            <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>İptal</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default ContentBox;
