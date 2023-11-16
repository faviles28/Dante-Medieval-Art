'use client'
import { useEffect, useState } from 'react';
import Canto from '../../../components/canto/Canto';
import Header from '../../../components/frame/Header';
import Footer from '../../../components/frame/Footer';

const CantoPage = () => {
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({ book: null, cantoNumber: null });

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

  if (!queryParams.book || !queryParams.cantoNumber) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Header />
      <div className='fade-in'>
        <Canto book={queryParams.book} cantoNumber={queryParams.cantoNumber} />
      </div>
      <Footer />
    </main>
  );
};

export default CantoPage;
