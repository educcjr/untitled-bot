import React from 'react';
import {
  AudioContainer,
  ThirdHeader,
  PlayList,
  AudioGrid,
  DeleteButton,
  Audio
} from '../styles/layout/audioList';
import DeleteIcon from './icons/DeleteIcon';
import '../styles/icons.css';

export class ExistingAudio extends React.Component {
  render () {
    const {
      userAudioGreetings,
      playAudio,
      deleteConfirmation
    } = this.props;

    return (
      <AudioContainer>
        <ThirdHeader>Current Greetings</ThirdHeader>
        <PlayList>
          {userAudioGreetings.map(({ url, name, id }, index) =>
            <AudioGrid key={index}>
              <Audio onClick={() => playAudio(url)}>{name}</Audio>
              <DeleteButton type='button' onClick={() => deleteConfirmation(name, id)}>
                <DeleteIcon />
              </DeleteButton>
            </AudioGrid>
          )}
        </PlayList>
      </AudioContainer>
    );
  }
}

export default ExistingAudio;
