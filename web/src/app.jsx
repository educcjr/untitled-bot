import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// Containers
import AudioGreetings from './containers/audio-greetings';

// Components
import { Navbar } from './components/Navbar';

// Pages
import { HomePage } from './components/pages/Home';

import UserService from './services/user-service';
import GreetingsService from './services/greetings-service';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.loadUsers = this.loadUsers.bind(this);

    const apiDomain = window.document.origin === 'http://www.untitled-lounge.com'
      ? 'http://35.193.250.139'
      : 'http://localhost:5000';
    this.userService = new UserService(apiDomain);
    this.greetingsService = new GreetingsService(apiDomain);

    this.state = {
      users: []
    };
  }

  loadUsers () {
    this.userService.getAll()
      .then(users => this.setState({
        users
      }));
  }

  render () {
    return (
      <Router>
        <div className='container'>
          <Navbar />
          <Route exact path='/' render={() => <HomePage />} />
          <Route path='/audio-greetings' render={() =>
            <AudioGreetings
              loadUsers={this.loadUsers}
              users={this.state.users}
              greetingsService={this.greetingsService} />
          } />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
