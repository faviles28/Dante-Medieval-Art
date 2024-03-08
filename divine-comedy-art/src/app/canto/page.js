'use client'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Canto from '../../../components/canto/Canto';
import Header from '../../../components/frame/Header';
import Footer from '../../../components/frame/Footer';

const books = [
  { name: 'inferno', cantos: 34 },
  { name: 'purgatorio', cantos: 33 },
  { name: 'paradiso', cantos: 33 },
];

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const CantoPage = () => {
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({ book: null, cantoNumber: null });

  const isAtStart = queryParams.book === 'inferno' && queryParams.cantoNumber === 1;
  const isAtEnd = queryParams.book === 'paradiso' && queryParams.cantoNumber === 33;

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const book = query.get('book');
    const cantoNumber = query.get('cantoNumber');
    
    if (book && cantoNumber) {
      setQueryParams({ book, cantoNumber: parseInt(cantoNumber) });
    }
  }, []);

  useEffect(() => {
    // Set a timeout to simulate loading and trigger animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  const navigateCanto = (direction) => {
    let bookIndex = books.findIndex(b => b.name === queryParams.book);
    let newCantoNumber = queryParams.cantoNumber + direction;
  
    if (newCantoNumber > books[bookIndex].cantos) {
      bookIndex = (bookIndex + 1) % books.length;
      newCantoNumber = 1;
    } else if (newCantoNumber < 1) {
      bookIndex = (bookIndex - 1 + books.length) % books.length;
      newCantoNumber = books[bookIndex].cantos;
    }
  
    setQueryParams({ book: books[bookIndex].name, cantoNumber: newCantoNumber });
    window.location.search = `?book=${books[bookIndex].name}&cantoNumber=${newCantoNumber}`;
  };

  const getNextCanto = (direction) => {
    let bookIndex = books.findIndex(b => b.name === queryParams.book);
    let newCantoNumber = queryParams.cantoNumber + direction;
  
    if (newCantoNumber > books[bookIndex].cantos) {
      bookIndex = (bookIndex + 1) % books.length;
      newCantoNumber = 1;
    } else if (newCantoNumber < 1) {
      bookIndex = (bookIndex - 1 + books.length) % books.length;
      newCantoNumber = books[bookIndex].cantos;
    }

    return { book: books[bookIndex].name, cantoNumber: newCantoNumber };
  };

  if (!queryParams.book || !queryParams.cantoNumber) {
    return <div className='loading-bar'></div>;
  }

  const previousCanto = getNextCanto(-1);
  const nextCanto = getNextCanto(1);

  return (
    <main>
      {!isAtStart && (
        <div className="nav-container left">
          <button className="nav-button-wrapper" onClick={() => navigateCanto(-1)}>
            <div className="nav-button left">{"⇦"}</div>
            <div className="canto-info">{`${capitalizeFirstLetter(previousCanto.book)} ${previousCanto.cantoNumber}`}</div>
          </button>
        </div>
      )}

      {!isAtEnd && (
        <div className="nav-container right">
          <button className="nav-button-wrapper" onClick={() => navigateCanto(1)}>
            <div className="nav-button right">{"⇨"}</div>
            <div className="canto-info">{`${capitalizeFirstLetter(nextCanto.book)} ${nextCanto.cantoNumber}`}</div>
          </button>
        </div>
      )}

      <Header />
      <div>
        <Canto book={queryParams.book} cantoNumber={queryParams.cantoNumber} />
      </div>
      <Footer />
    </main>
  );
};

export default CantoPage;