import React from 'react';

/**
 * ExistingAudio
 */
export class ExistingAudio extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const userAudioGreetings = this.props.userAudioGreetings,
          playAudio = this.props.playAudio,
          deleteConfirmation = this.props.deleteConfirmation;

    return (
      <div style={{paddingTop: '20px'}}>
        <h3>Existing audios</h3>
        <div style={{paddingTop: '10px'}}>
          {userAudioGreetings.map((audio, index) =>
            <div key={index}
              style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center'
              }}>
              <div onClick={() => playAudio(audio.path)}
                style={{
                  cursor: 'pointer',
                  minWidth: '50px',
                  border: '1px solid #b1b1b1',
                  borderRadius: '5px',
                  display: 'inline-block',
                  padding: '10px'
                }}>{audio.name}</div>
              <button
                style={{marginLeft: '10px', cursor: 'pointer'}}
                type='button'
                className='btn btn-danger'
                onClick={() => deleteConfirmation(audio.name)}
              >Delete</button>
            </div>
          )}
        </div>
      </div>
      );
      }
    }

export default ExistingAudio;
