import React, { useState } from "react";
import './Search.css';
import Pagination from "../pagination/Pagination"; // Pagination bileşenini içe aktar

interface SearchProps {
    onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]); // Arama sonuçlarını tutar
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Sayfa başına gösterilecek kayıt sayısı

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query); // Arama yap
    };

    // Sayfalamaya uygun verileri hesapla
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedResults = searchResults.slice(startIndex, startIndex + rowsPerPage);
    const totalPages = Math.ceil(searchResults.length / rowsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Egzersiz adına göre ara..."
            />
            <button onClick={handleSearch}>Ara</button>
            
            {searchResults.length > 0 && (
                <div className="search-results">
                    <table>
                        <thead>
                            <tr>
                                <th>No:</th>
                                <th>Egzersiz</th>
                                <th>Ağırlık (kg)</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedResults.map((result, index) => (
                                <tr key={result.id}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{result.exercise}</td>
                                    <td>{result.weight}</td>
                                    <td>{result.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Search;
