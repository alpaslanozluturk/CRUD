import React, { useState } from "react";
import './Search.css';

interface SearchProps {
    onSearch: (query: string, page: number, rowsPerPage: number) => Promise<{ results: any[], totalPages: number }>;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = async () => {
        await onSearch(query, 1, 10); // İlk sayfada, 10 kayıt göster
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
        </div>
    );
};

export default Search;
