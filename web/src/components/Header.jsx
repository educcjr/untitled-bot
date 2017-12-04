import React from 'react';

export class Header extends React.Component {
  render() {
    const title = this.props.title;
    return (
      <header>
        <h1>{title}</h1>
      </header>
    );
  }
}

export default Header;
