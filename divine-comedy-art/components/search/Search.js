'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { corpusData } from '../../corpus/corpusData';

const Search = () => {
  const [book, setBook] = useState('');
  const [cantoNumber, setCantoNumber] = useState('');
  const [query, setQuery] = useState(''); // State to hold the user's text query
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const handleBookChange = (e) => {
    setBook(e.target.value);
  };

  const handleCantoChange = (e) => {
    setCantoNumber(e.target.value);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value); // Update the query state based on user input
  };

  const searchCanto = () => {
    if (query) {
      const results = corpusData
        .filter(d => book ? d.book === book : true) // Filters to the selected book if one is chosen
        .flatMap(d => d.cantos
          .filter(c => cantoNumber ? c.number.toString() === cantoNumber : true) // Further filter to the selected canto if one is chosen
          .flatMap(c => {
            // Find all lines that match the query within the filtered cantos
            return c.text
              .filter(lineObj => lineObj.text.toLowerCase().includes(query.toLowerCase()))
              .flatMap(lineObj => {
                let startIndex = lineObj.line_number - ((lineObj.line_number - 1) % 3) - 1;
                if (lineObj.line_number === c.text.length) {
                  startIndex = lineObj.line_number - 1; // The last line itself is a stanza
                }
                const stanzaLines = c.text.slice(startIndex, startIndex + 3).map(obj => `${obj.line_number}. ${obj.text}`);
                return {
                  book: d.book,
                  canto: c.number,
                  text: stanzaLines
                };
              });
          })
          .filter(stanza => stanza.text.length > 0)
        );
        setSearchResults(results);
        console.log(results);
        localStorage.setItem('searchResults', JSON.stringify(results));
        router.push('/stanzas');
    } else if (book && cantoNumber) {
      // If no textual query, but book and canto are selected, navigate to the specific canto page
      router.push(`/canto?book=${book}&cantoNumber=${cantoNumber}`);
    }
  };

  return (
    <div className="search-container">
            <select onChange={handleBookChange} value={book}>
        <option value="" disabled>Select Book</option>
        <option value="inferno">Inferno</option>
        <option value="purgatorio">Purgatorio</option>
        <option value="paradiso">Paradiso</option>
      </select>
      <select onChange={handleCantoChange} value={cantoNumber} disabled={!book}>
        <option value="" disabled>Select Canto</option>
        {[...Array(book === 'inferno' ? 34 : 33)].map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
      <input type="text" onChange={handleQueryChange} value={query} placeholder="Search text..." />
      <button onClick={searchCanto} disabled={!book && !query}>Search</button>
    </div>
  );
};

export default Search;

