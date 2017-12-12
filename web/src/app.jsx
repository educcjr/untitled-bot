import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// Styles
import normalize from './styles/base/normalize';
import reset from './styles/base/reset';
import typography from './styles/base/typography';

// Containers
// import AudioGreetings from './containers/audio-greetings';

// Pages
import { HomePage } from './components/pages/Home';
import { GreetingsPage } from './components/pages/Greetings';

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
        <div>
          <Route exact path='/' render={() => <HomePage />} />
          <Route path='/audio-greetings' render={() =>
            // <AudioGreetings
            //   loadUsers={this.loadUsers}
            //   users={this.state.users}
            //   greetingsService={this.greetingsService} />
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
