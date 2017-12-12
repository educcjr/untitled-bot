import React from 'react';
import App from '../../app';
import { Link } from 'react-router-dom';

// Container
import AudioGreetings from '../../containers/audio-greetings';

// Components
import { Header } from '../Header';

// Styles
import { Background } from '../../styles/pages/home';
import { Button } from '../../styles/layout/button';
import { SecondTitle } from '../../styles/layout/header';

export class GreetingsPage extends React.Component {
  render() {
    const users = this.props.users,
          loadUsers = this.props.loadUsers,
          greetingsService = this.props.greetingsService;
    return (
      <Background>
        <Header title="titled bot" />
        <SecondTitle>Audio Greetings</SecondTitle>
        <AudioGreetings
          loadUsers={loadUsers}
          users={users}
          greetingsService={greetingsService}
        />
        <Button home to='/'>Home</Button>
      </Background>
    );
  }
}

export default GreetingsPage;
