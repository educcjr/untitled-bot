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

export class ExistingAudio extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const userAudioGreetings = this.props.userAudioGreetings,
          playAudio = this.props.playAudio,
          deleteConfirmation = this.props.deleteConfirmation;

    return (
      <AudioContainer>
        <ThirdHeader>Current Greetings</ThirdHeader>
        <PlayList>
          {userAudioGreetings.map((audio, index) =>
            <AudioGrid key={index}>
              <Audio onClick={() => playAudio(audio.path)}>{audio.name}</Audio>
              <DeleteButton type='button' onClick={() => deleteConfirmation(audio.name)}>
                <DeleteIcon/>
              </DeleteButton>
            </AudioGrid>
          )}
        </PlayList>
      </AudioContainer>
      );
      }
    }

export default ExistingAudio;
