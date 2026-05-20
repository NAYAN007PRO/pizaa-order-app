import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer'; // Import Footer
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer /> {/* Add Footer here */}
    </>
  );
};

export default MainLayout;