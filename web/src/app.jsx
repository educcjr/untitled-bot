import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <div>
            <Link to='/'>Home</Link> |
            <Link to='/voice-greetings'>Voice greetings</Link>
          </div>

          <Route exact path='/' render={() => <h1>Untitled Bot Page</h1>} />
          <Route path='/voice-greetings' render={() => <h1>Voice greetings</h1>} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
