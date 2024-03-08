"use client"
import React from 'react';
import { useRef } from 'react';
import { dataTags } from '../../corpus/dataTags';

const Word = React.forwardRef(({ word, onClick, highlight, selected }, ref) => (
  <span
    ref={ref}
    onClick={onClick}
    className={`word ${highlight ? 'highlight' : ''} ${selected ? 'selected' : ''}`}
  >
    {word}
  </span>
));

const Stanza = ({ book, cantoNumber, stanzaLines }) => {
  const wordRefs = useRef(new Map()).current; // Optional if you want to support scrolling to words

  // Helper function similar to what's in Canto to determine if a word is a primary/secondary term
  const renderWord = (word, wordIndex) => {
    const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    let tag = null;
    let primaryTerm = null;
  
    for (let [key, value] of dataTags.entries()) {
      if (key === cleanedWord || value.secondaries.includes(cleanedWord)) {
        tag = value;
        primaryTerm = key;
        break;
      }
    }
  
    if (primaryTerm) {
      return (
        <a
          key={wordIndex}
          href={`https://theindex.princeton.edu/s/view/ViewSubject.action?id=${tag.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hyperlink"
          ref={wordRefs.get(cleanedWord)} // Assuming you've set up refs similarly
        >
          {word}
        </a>
      );
    } else {
      return <Word key={wordIndex} word={word} />; // Simplified for demonstration
    }
  };

  const renderStanzaLines = () => {
    return stanzaLines.map((line, index) => (
      <div className="line-container" key={`line-${index}`}>
        <span className="line">
          {line.split(/(\s+|,|\.|;|:|\?|!|-)/).filter(Boolean).map((word, wordIndex) => renderWord(word, wordIndex))}
        </span>
      </div>
    ));
  };

  return (
    <div className="stanza">
      <h2>{`${book.charAt(0).toUpperCase() + book.slice(1)} - Canto ${cantoNumber}`}</h2>
      <div className="stanza-lines">
        {renderStanzaLines()}
      </div>
    </div>
  );
};

export default Stanza;
