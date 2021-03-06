import React from 'react';

export class DeleteIcon extends React.Component {
  render() {
    return (
      <div>
        <svg version="1.1" x="0px" y="0px"
        viewBox="0 0 500 500" className="un-delete">
          <g className="cover">
            <rect x="80" y="20" width="125" height="70" rx="10"/>
            <rect x="105.5" y="33" width="75" rx="10" height="25" className="handlebar"/>
            <rect x="2" y="55" width="285" height="40" rx="20"/>
            <rect x="2" y="70" width="285" height="35"/>
          </g>
          <g className="can">
            <rect x="10" y="112" width="270" height="50"/>
            <rect x="20" y="120" width="250" height="280" ry="30"/>
            <rect x="120" y="170" width="50" height="190" ry="15" className="indents"/>
            <rect x="60" y="170" width="30" height="190" ry="10" className="indents"/>
            <rect x="199" y="170" width="30" height="190" ry="10" className="indents"/>
          </g>
        </svg>
      </div>
    );
  }
}





export default DeleteIcon;
