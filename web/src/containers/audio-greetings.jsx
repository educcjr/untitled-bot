import React from 'react';

// Components
import { Header } from '../components/Header';
import { AudioForm } from '../components/AudioForm';
import { ExistingAudio } from '../components/ExistingAudio';
import { DeleteModal } from '../components/DeleteModal';

// Styles
import { FormWrapper } from '../styles/layout/audioForm';

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
        if (result.name) {
          this.setState({
            uploadResponse: `Arquivo ${result.name} enviado com sucesso.`,
            userAudioGreetings: [
              { name: result.name, path: result.path },
              ...this.state.userAudioGreetings
            ]
          });
        } else {
          this.setState({uploadResponse: result.message});
        }
      });
  }

  playAudio (path) {
    let audio = new Audio(path);
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
          userAudioGreetings: this.state.userAudioGreetings.filter(
            file => file.name !== this.state.toDelete
          )
        });
      });
    $('#deleteModal').modal('hide');
  }

  render () {
    return (
      <FormWrapper>
        <div>
          {/* Audio Form Component - Start  */}
          <AudioForm
            onSubmit={this.onSubmit}
            onUserChange={this.onUserChange}
            value={this.state.userDiscordId}
            users={this.props.users}
            onFileChange={this.onFileChange}
          />
          {/* Audio Form Component - End */}

          <div>{this.state.uploadResponse}</div>

          {/* ExistingAudio Component - Start */}
          <ExistingAudio
            playAudio={this.playAudio}
            deleteConfirmation={this.deleteConfirmation}
            userAudioGreetings={this.state.userAudioGreetings}
          />
          {/* ExistingAudio Component - End */}
        </div>

        {/* Modal Component - Start */}
        <DeleteModal
          toDelete={this.state.toDelete}
          deleteAudio={this.deleteAudio}
        />
        {/* Modal Component - End */}
      </FormWrapper>
    );
  }
}

export default AudioGreetings;
