import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav>
      <Link to='/'>Home</Link> |
      <Link to='/audio-greetings'>Audio greetings</Link>
    </nav>
  );
}
