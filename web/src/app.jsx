import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Styles
import './styles/icons.css';

// Pages
import { HomePage } from './components/pages/Home';
import { GreetingsPage } from './components/pages/Greetings';

import UserService from './services/user-service';
import GreetingsService from './services/greetings-service';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.loadUsers = this.loadUsers.bind(this);

    const apiDomain = window.origin === 'http://www.untitled-lounge.com'
      ? 'https://untitled-lounge.herokuapp.com'
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
        <div>
          <Route exact path='/' render={() => <HomePage />} />
          <Route path='/audio-greetings' render={() =>
            <GreetingsPage
              users={this.state.users}
              loadUsers={this.loadUsers}
              greetingsService={this.greetingsService}
            />
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
