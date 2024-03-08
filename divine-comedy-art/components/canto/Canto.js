import React, { useState, useEffect, useRef } from "react";
import { corpusData } from "../../corpus/corpusData";
import { dataTags } from "../../corpus/dataTags";

const Word = React.forwardRef(({ word, onClick, highlight, selected }, ref) => (
  <span
    ref={ref}
    onClick={onClick}
    className={`word ${highlight ? 'highlight' : ''} ${selected ? 'selected' : ''}`}
  >
    {word}
  </span>
));

function Canto({ book, cantoNumber }) {
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const wordRefs = useRef(new Map()).current;

  const bookData = corpusData.find((data) => data.book === book);

  if (!bookData) {
    return <div>Book not found</div>;
  }

  const cantoData = bookData.cantos.find((canto) => canto.number === cantoNumber);

  if (!cantoData) {
    return <div>Canto not found</div>;
  }

  const extractUniqueWords = (textObjects) => {
    const allWords = textObjects.flatMap(lineObj => 
        lineObj.text.split(/(\s+|,|\.|;|:|\?|!|-)/).filter(word => Boolean(word) && word !== "\n")
    );
    return [...new Set(allWords.map(word => word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")))];
};

  const handleWordClick = (primaryWord) => {
    setHighlightedWords(prev => prev.includes(primaryWord) ? prev : [...prev, primaryWord]);
    setSelectedWord(primaryWord);

    const secondaryWords = dataTags.get(primaryWord)?.secondaries || [];
    [primaryWord, ...secondaryWords].forEach(word => {
        let wordRef = wordRefs.get(word);
        if (wordRef && wordRef.current) {
            wordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Exit the loop after scrolling to the first instance
        }
    });
};

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  const renderLegend = () => {
    const textWords = extractUniqueWords(cantoData.text);
    let primaryTermsInText = new Set();
  
    textWords.forEach(word => {
      for (let [primary, { secondaries }] of dataTags) {
        if (primary === word || secondaries.includes(word)) {
          primaryTermsInText.add(primary);
          break;
        }
      }
    });
  
    return (
      <div className={`legend ${showLegend ? 'open' : ''}`}>
        <div className="legend-container">
          {Array.from(primaryTermsInText).map(primaryWord => (
            <button 
              key={primaryWord} 
              onClick={() => handleWordClick(primaryWord)}
              className="legend-button-word"
            >
              {primaryWord}
            </button>
          ))}
        </div>
      </div>
    );
  };
  

  const renderCantoText = () => {
    return cantoData.text.flatMap((lineObj, index, array) => {
      // Check if the lineObj.text ends with a newline character to handle spacing
      const endsWithNewline = lineObj.text.endsWith("\n");
      const lineText = endsWithNewline ? lineObj.text.slice(0, -1) : lineObj.text; // Remove the newline character for rendering
      const words = lineText.split(/(\s+|,|\.|;|:|\?|!|-)/).filter(Boolean);
      
      const lineContent = (
        <div className="line-container" key={`line-${index}`}>
          <span className="line-number">{lineObj.line_number}</span>
          <p>
            {words.length > 0 ? words.map((word, wordIndex) => renderWord(word, wordIndex)) : "\u00A0"}
          </p>
        </div>
      );
  
      // If the line ends with a newline character, add a <br /> to visually represent the empty line
      if (endsWithNewline && index !== array.length - 1) { // Ensure we don't add an extra break at the end of the canto
        return [lineContent, <br key={`break-${index}`} />];
      } else {
        return lineContent;
      }
    });
  };
  

  const renderWord = (word, wordIndex) => {
    const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    let tag = null;
    let primaryTerm = null;
  
    // Search through dataTags to find if the word is a primary or secondary term
    for (let [key, value] of dataTags.entries()) {
      if (key === cleanedWord || value.secondaries.includes(cleanedWord)) {
        tag = value;
        primaryTerm = key;
        break;
      }
    }
  
    const isHighlighted = highlightedWords.includes(primaryTerm);
    const isSelected = selectedWord === primaryTerm;
  
    // Set a ref for scrolling to this word if it's a primary or secondary term
    if (primaryTerm && !wordRefs.has(cleanedWord)) {
      wordRefs.set(cleanedWord, React.createRef());
    }
    const ref = wordRefs.get(cleanedWord);
  
    // If the word is a primary or secondary term, render it as a hyperlink
    if (primaryTerm) {
      return (
        <a
          key={wordIndex}
          href={`https://theindex.princeton.edu/s/view/ViewSubject.action?id=${tag.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`hyperlink ${isHighlighted ? 'highlight' : ''}`}
          ref={ref}
          onClick={() => handleWordClick(primaryTerm)}
        >
          {word}
        </a>
      );
    } else {
      // If not, render it as a regular word
      return (
        <Word
          key={wordIndex}
          ref={ref}
          word={word}
          highlight={isHighlighted}
          selected={isSelected}
          onClick={() => handleWordClick(cleanedWord)}
        />
      );
    }
  };

  return (
    <div className="canto">
      <h2>
        {book.charAt(0).toUpperCase() + book.slice(1)} - Canto {cantoNumber}
      </h2>
      <button 
        className={`legend-button ${showLegend ? 'open' : ''}`} 
        onClick={toggleLegend} 
        style={{ marginBottom: '10px' }}
      >
        Legend
      </button>
      {renderLegend()}
      {renderCantoText()}
    </div>
  );
}

export default Canto