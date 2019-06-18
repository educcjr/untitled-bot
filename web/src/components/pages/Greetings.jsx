import React from 'react';

// Container
import AudioGreetings from '../../containers/audio-greetings';

// Components
import { Header } from '../Header';

// Styles
import { Background } from '../../styles/pages/home';
import { Button } from '../../styles/layout/button';
import { SecondTitle } from '../../styles/layout/header';

export class GreetingsPage extends React.Component {
  render () {
    const {
      users,
      loadUsers,
      greetingsService
    } = this.props;

    return (
      <Background>
        <Header title='titled bot' />
        <SecondTitle>Audio Greetings</SecondTitle>
        <AudioGreetings
          loadUsers={loadUsers}
          users={users}
          greetingsService={greetingsService}
        />
        <Button to='/'>Home</Button>
      </Background>
    );
  }
}

export default GreetingsPage;
