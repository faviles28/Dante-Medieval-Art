'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search = () => {
  const [book, setBook] = useState('');
  const [cantoNumber, setCantoNumber] = useState('');
  const router = useRouter();

  const handleBookChange = (e) => {
    setBook(e.target.value);
  };

  const handleCantoChange = (e) => {
    setCantoNumber(e.target.value);
  };

  const searchCanto = () => {
    router.push(`/canto?book=${book}&cantoNumber=${cantoNumber}`);
  };

  return (
    <div className="search-container">
      <select onChange={handleBookChange} value={book}>
        <option value="" disabled>Select Book</option>
        <option value="inferno">Inferno</option>
        <option value="paradiso">Paradiso</option>
        <option value="purgatorio">Purgatorio</option>
      </select>
      <select onChange={handleCantoChange} value={cantoNumber} disabled={!book}>
        <option value="" disabled>Select Canto</option>
        {[...Array(book === 'inferno' ? 34 : 33)].map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
      <button onClick={searchCanto} disabled={!book || !cantoNumber}>Search</button>
    </div>
  );
};

export default Search;
