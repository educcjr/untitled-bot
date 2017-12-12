import React from 'react';
import {
  UntitledHeader,
  MainTitle,
  Logo
} from '../styles/layout/header';
import '../styles/icons.css';


export class Header extends React.Component {
  render() {
    const title = this.props.title;
    return (
        <UntitledHeader>
          <Logo>
            <svg version="1.1" x="0px" y="0px"
            viewBox="0 0 445.8 377.6" className="un-logo">
              <g>
                <rect x="0" y="0" width="376.9" height="44" />
                <rect x="-0.5" y="0.5" width="44" height="376.9" />
              </g>
              <g>
                <rect x="68.9" y="333.7" width="376.9" height="44" />
                <rect x="402.3" y="0.2" width="44" height="376.9" />
              </g>
              <g>
                <text transform="matrix(1 0 0 1 41.2083 289)">UN</text>
              </g>
            </svg>
          </Logo>
          <MainTitle>{title}</MainTitle>
        </UntitledHeader>


    );
  }
}

// export default Header;
