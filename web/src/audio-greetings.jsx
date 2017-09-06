import React from 'react';

class AudioGreetings extends React.Component {
  constructor (props) {
    super(props);
    this.onUserChange = this.onUserChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      userDiscordId: '',
      audioFile: {},
      uploadResponse: ''
    };
  }

  componentDidMount () {
    this.props.loadUsers();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.users.length > 0) {
      this.setState({userDiscordId: nextProps.users[0].discordId});
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
    this.props.uploadAudioGreetings(this.state.userDiscordId, this.state.audioFile)
      .then(result => {
        this.setState({uploadResponse: result.filename
          ? `Arquivo ${result.filename} enviado com sucesso.`
          : result.message
        });
      });
  }

  render () {
    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          <h1>Voice greetings</h1>
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
        </div>
      </div>
    );
  }
}

export default AudioGreetings;
