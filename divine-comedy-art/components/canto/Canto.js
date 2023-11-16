import { corpusData } from "../../corpus/corpusData";
import { dataTags } from "../../corpus/dataTags";
import React from "react";

function Canto({ book, cantoNumber }) {
  const bookData = corpusData.find((data) => data.book === book);

  if (!bookData) {
    return <div>Book not found</div>;
  }

  const cantoData = bookData.cantos.find((canto) => canto.number === cantoNumber);

  if (!cantoData) {
    return <div>Canto not found</div>;
  }

  function renderCantoText() {
    return cantoData.text.map((line, index) => {
      // Splitting the line into words and punctuation using regular expression
      const words = line.split(/(\s+|,|\.|;|:|\?|!|-)/).filter(Boolean);
  
      // Mapping each word or punctuation to a JSX element
      const lineContent = words.map((word, wordIndex) => {
        // Removing punctuation for comparison
        const cleanedWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        const tagId = dataTags.get(cleanedWord);
  
        // If the word has a corresponding tag, create a hyperlink
        if (tagId) {
          return <a
            key={wordIndex}
            href={`https://theindex.princeton.edu/s/view/ViewSubject.action?id=${tagId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hyperlink"
          >
            {word}
          </a>;
        } else {
          // Else, return the word as is
          return word;
        }
      });
  
      return <p key={index}>{line === "" ? "\u00A0" : lineContent}</p>;
    });
  };

  return (
    <div className="canto">
      <h2>
        {book.charAt(0).toUpperCase() + book.slice(1)} - Canto {cantoNumber}
      </h2>
      {renderCantoText()}
    </div>
  );
}

export default Canto;
