import React from 'react';

const audioBucket = 'https://storage.googleapis.com/untitled-bot-174418.appspot.com/greetings/';

class AudioGreetings extends React.Component {
  constructor (props) {
    super(props);

    this.onUserChange = this.onUserChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);

    this.state = {
      userDiscordId: '',
      audioFile: {},
      uploadResponse: '',
      userAudioGreetings: [],
      toDelete: ''
    };
  }

  componentDidMount () {
    this.props.loadUsers();
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.users.length > 0 && nextState.userDiscordId === '') {
      this.setState({userDiscordId: nextProps.users[0].discordId});
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.userDiscordId !== prevState.userDiscordId) {
      this.props.greetingsService.get(this.state.userDiscordId)
        .then(userAudioGreetings => this.setState({ userAudioGreetings }));
    }
  }

  onUserChange (evt) {
    this.setState({userDiscordId: evt.target.value});
  }

  onFileChange (evt) {
    this.setState({audioFile: evt.target.files[0]});
  }

  onSubmit (evt) {
    evt.preventDefault();
    this.setState({uploadResponse: 'Enviando...'});
    this.props.greetingsService.post(this.state.userDiscordId, this.state.audioFile)
      .then(result => {
        this.setState({
          uploadResponse: result.filename
            ? `Arquivo ${result.filename} enviado com sucesso.`
            : result.message,
          userAudioGreetings: [ result.filename, ...this.state.userAudioGreetings ]
        });
      });
  }

  playAudio (name) {
    let audio = new Audio(audioBucket + name);
    audio.play();
  }

  deleteConfirmation (name) {
    this.setState({toDelete: name});
    $('#deleteModal').modal('show');
  }

  deleteAudio () {
    this.props.greetingsService.delete(this.state.toDelete)
      .then(() => {
        this.setState({
          userAudioGreetings: this.state.userAudioGreetings.filter(file => file !== this.state.toDelete)
        });
      });
    $('#deleteModal').modal('hide');
  }

  render () {
    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          <h1>Audio greetings</h1>
        </div>
        <div>
          <form style={{width: '300px', textOverflow: 'ellipsis'}} onSubmit={this.onSubmit}>
            <div className='form-group'>
              <select className='form-control' onChange={this.onUserChange} value={this.state.userDiscordId}>
                {this.props.users.map((user, index) => (
                  <option key={index} value={user.discordId}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <input className='form-control-file' type='file' accept='audio/*' onChange={this.onFileChange} style={{width: '100%'}} />
            </div>
            <div className='form-group'>
              <input className='btn btn-primary' type='submit' />
            </div>
          </form>
          <div>{this.state.uploadResponse}</div>
          <div style={{paddingTop: '20px'}}>
            <h3>Existing audios</h3>
            <div style={{paddingTop: '10px'}}>
              {this.state.userAudioGreetings.map((audio, index) =>
                <div key={index}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <div onClick={() => this.playAudio(audio)}
                    style={{
                      cursor: 'pointer',
                      minWidth: '50px',
                      border: '1px solid #b1b1b1',
                      borderRadius: '5px',
                      display: 'inline-block',
                      padding: '10px'
                    }}>{audio}</div>
                  <button
                    style={{marginLeft: '10px', cursor: 'pointer'}}
                    type='button'
                    className='btn btn-danger'
                    onClick={() => this.deleteConfirmation(audio)}
                  >Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='modal fade' id='deleteModal'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Confirmation</h5>
                <button type='button' className='close' data-dismiss='modal'>
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p>Delete {this.state.toDelete} file?</p>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-primary' style={{cursor: 'pointer'}} onClick={this.deleteAudio}>Delete</button>
                <button type='button' className='btn btn-secondary' style={{cursor: 'pointer'}} data-dismiss='modal'>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AudioGreetings;
