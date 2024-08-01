// App.tsx
import React from "react";
import './App.css';
import VerticalContainer from '../vertical-container/VerticalContainer';
import ContentBox from "src/content-box/ContentBox";
import Modal from "react-modal";
import { GymRecord } from '../entities/GymRecord';

// Modal'ın erişim elemanını ayarlayın
Modal.setAppElement('#root');

export function App() {
  const [records, setRecords] = React.useState<GymRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newExercise, setNewExercise] = React.useState('');
  const [newWeight, setNewWeight] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

  React.useEffect(() => {
    fetch("http://localhost:8080/gym/records", {
      method: "GET"
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    }).then(data => {
      if (data !== null) {
        setRecords(data);
      }
    });
  }, []);

  const handleCreateSubmit = () => {
    fetch("http://localhost:8080/gym/records", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ exercise: newExercise, weight: newWeight })
    }).then(response => {
      if (response.status === 201) {
        return response.json();
      }
      return null;
    }).then(data => {
      if (data !== null) {
        setRecords([...records, data]);
        setIsModalOpen(false);
        setNewExercise('');
        setNewWeight(0);
      }
    });
  };

  const handleUpdateSubmit = (recordToUpdate: GymRecord) => {
    fetch(`http://localhost:8080/gym/records/${recordToUpdate.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ exercise: recordToUpdate.exercise, weight: recordToUpdate.weight })
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    }).then(data => {
      if (data !== null) {
        setRecords(records.map(record => (record.id === data.id ? { ...record, exercise: data.exercise, weight: data.weight } : record)));
      }
    });
  };

  const handleDeleteSubmit = (id: number) => {
    fetch(`http://localhost:8080/gym/records/${id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" }
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    }).then(data => {
      if (data !== null) {
        setRecords(records.filter(record => record.id !== data.id));
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-component">
      <VerticalContainer className="custom-vertical-container">
        <div className="content-box-container">
          <h2>Gym</h2>
          
          
          <table className="content-box-table">
            

          </table>
          <ContentBox
            content={records}
            onSubmitUpdate={handleUpdateSubmit}
            onSubmitDelete={handleDeleteSubmit}
            onAddNewRecord={() => setIsModalOpen(true)}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
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
        <form onSubmit={(e) => { e.preventDefault(); handleCreateSubmit(); }}>
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
