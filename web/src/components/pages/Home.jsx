import React from 'react';
import { Link } from 'react-router-dom';

// Components
import { Header } from '../Header'
import { Navbar } from '../Navbar';

// Styles
import {
  Background,
  UntitledIntro,
  UntitledParagraph
}  from '../../styles/pages/home';

import {
  UntitledNav,
  Button
} from '../../styles/layout/button';

export class HomePage extends React.Component {
  render() {
    return (
      <Background>
        <Header title="titled Bot"/>
        <UntitledIntro>
          <UntitledParagraph>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Repellat dolorum aliquid perspiciatis animi magnam cum itaque
            dicta quas, laborum quia asperiores, voluptas exercitationem
            earum! Nihil libero, doloribus distinctio hic non!
          </UntitledParagraph>
        </UntitledIntro>
        <UntitledNav>
          <Button to='/'>Commands</Button>
          <Button to='/audio-greetings'>Audio greetings</Button>
        </UntitledNav>
      </Background>
    );
  }
}

export default HomePage;
