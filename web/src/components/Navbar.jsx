import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div style={{marginBottom: '20px'}}>
      <Link to='/'>Home</Link> |
      <Link to='/audio-greetings'>Audio greetings</Link>
    </div>
  );
}
