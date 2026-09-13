import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='footer'>
      <h1 className='text-center'>All Right Reserved &copy; Sky</h1>
      <Link to='/About'>About</Link>|
      <Link to='/contact'>Contact</Link>|
      <Link to='/policy'>Privacy Policy</Link>
    </div>
  );
};

export default Footer;