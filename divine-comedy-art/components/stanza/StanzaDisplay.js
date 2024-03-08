"use client"
import React from 'react';
import Stanza from './Stanza';

const StanzasDisplay = ({ searchResults }) => {
    return (
        <div>
        {searchResults.map((result, index) => (
            <div key={index}>
            <Stanza 
                book={result.book} 
                cantoNumber={result.canto} 
                stanzaLines={result.text} />
            </div>
        ))}
        </div>
    );
};

export default StanzasDisplay;
