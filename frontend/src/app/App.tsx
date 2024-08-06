import React, { useState, useEffect } from "react";
import './App.css';
import VerticalContainer from '../vertical-container/VerticalContainer';
import TransactionsContentBox from "src/content-box/TransactionsContentBox";
import Modal from "react-modal";
import { GymRecord } from '../entities/GymRecord';

// Modal'ın erişim elemanını ayarlayın
Modal.setAppElement('#root');

export function App() {
  const [records, setRecords] = useState<GymRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState('');
  const [newWeight, setNewWeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;
  const [searchResults, setSearchResults] = useState<GymRecord[]>([]);
  const [searchTotalPages, setSearchTotalPages] = useState(1);

  const fetchRecords = async (page: number, size: number) => {
    const response = await fetch(`http://localhost:8080/gym/records/page?page=${page}&size=${size}`);
    if (response.status === 200) {
      const data = await response.json();
      data.content.forEach((record: GymRecord, index: number) => {
        record.sequenceNumber = (page) * size + index + 1;
      });
      setRecords(data.content);
      setTotalPages(data.totalPages);
    }
  };

  useEffect(() => {
    fetchRecords(currentPage - 1, rowsPerPage);
  }, [currentPage]);

  const handleCreateSubmit = async (exercise: string, weight: number): Promise<GymRecord> => {
    const response = await fetch("http://localhost:8080/gym/records", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ exercise, weight })
    });
    if (response.status === 201) {
      const data = await response.json();
      const lastPage = Math.ceil((records.length + 1) / rowsPerPage);
      setCurrentPage(lastPage);
      fetchRecords(lastPage - 1, rowsPerPage);
      setIsModalOpen(false);
      setNewExercise('');
      setNewWeight(0);
      return data;
    }
    throw new Error("Failed to create record");
  };

  const handleUpdateSubmit = async (recordToUpdate: GymRecord) => {
    const response = await fetch(`http://localhost:8080/gym/records/${recordToUpdate.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ exercise: recordToUpdate.exercise, weight: recordToUpdate.weight })
    });
    if (response.status === 200) {
      const data = await response.json();
      setRecords(records.map(record => (record.id === data.id ? { ...data, sequenceNumber: record.sequenceNumber } : record)));
    }
  };

  const handleDeleteSubmit = async (id: number) => {
    const response = await fetch(`http://localhost:8080/gym/records/${id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" }
    });
    if (response.status === 200) {
      const newRecords = records.filter(record => record.id !== id);
      const newCurrentPage = (newRecords.length % rowsPerPage === 0 && currentPage > 1) ? currentPage - 1 : currentPage;
      setCurrentPage(newCurrentPage);
      fetchRecords(newCurrentPage - 1, rowsPerPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = async (query: string, page: number, rowsPerPage: number): Promise<{ results: GymRecord[], totalPages: number }> => {
    const response = await fetch(`http://localhost:8080/gym/records/search?query=${query}&page=${page}&size=${rowsPerPage}`);
    if (response.status === 200) {
      const data = await response.json();
      setSearchResults(data.content);
      setSearchTotalPages(data.totalPages);
      return { results: data.content, totalPages: data.totalPages };
    }
    return { results: [], totalPages: 0 };
  };

  const handleCloseSearchModal = () => {
    setSearchResults([]);
  };

  return (
    <div className="main-component">
      <VerticalContainer className="custom-vertical-container">
        <div className="content-box-container">
          <h2>Gym</h2>
          <TransactionsContentBox
            content={records}
            onSubmitUpdate={handleUpdateSubmit}
            onSubmitDelete={handleDeleteSubmit}
            onCreateRecord={handleCreateSubmit}
            onAddNewRecord={() => setIsModalOpen(true)}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            setRecords={setRecords}
            records={records}
            onSearch={handleSearch}
            onCloseSearchModal={handleCloseSearchModal}
          />
        </div>
      </VerticalContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Yeni Kayıt Ekle"
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
        <h2>Yeni Kayıt Ekle</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateSubmit(newExercise, newWeight); }}>
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="Egzersiz adı"
          />
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(parseInt(e.target.value, 10))}
            placeholder="Ağırlık (kg)"
          />
          <button type="submit">Kaydet</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>İptal</button>
        </form>
      </Modal>
    </div>
  );
}

export default App;
