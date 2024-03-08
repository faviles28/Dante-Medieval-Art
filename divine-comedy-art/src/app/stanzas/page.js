"use client"
import React, { useEffect, useState } from 'react';
import StanzasDisplay from '../../../components/stanza/StanzaDisplay';

const StanzasDisplayPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Retrieve the search results from local storage when the component mounts
    const results = localStorage.getItem('searchResults');
    if (results) {
      setSearchResults(JSON.parse(results));
    }
  }, []);

  return (
    <div>
      <StanzasDisplay searchResults={searchResults} />
    </div>
  );
};

export default StanzasDisplayPage;
