import React from 'react';

// Components
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
      toDeleteName: '',
      toDeleteId: ''
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
    this.setState({ uploadResponse: 'Enviando...' });
    this.props.greetingsService.post(this.state.userDiscordId, this.state.audioFile)
      .then(({ id, name, url, message }) => {
        if (name) {
          this.setState({
            uploadResponse: `Arquivo ${name} enviado com sucesso.`,
            userAudioGreetings: [
              { id, name, url },
              ...this.state.userAudioGreetings
            ]
          });
        } else {
          this.setState({ uploadResponse: message });
        }
      });
  }

  playAudio (url) {
    let audio = new Audio(url);
    audio.play();
  }

  deleteConfirmation (name, id) {
    this.setState({ toDeleteName: name, toDeleteId: id });
    $('#deleteModal').modal('show');
  }

  deleteAudio () {
    this.props.greetingsService.delete(this.state.toDeleteId)
      .then(() => {
        this.setState({
          userAudioGreetings: this.state.userAudioGreetings.filter(
            ({ id }) => id !== this.state.toDeleteId
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
          name={this.state.toDeleteName}
          deleteAudio={this.deleteAudio}
        />
        {/* Modal Component - End */}
      </FormWrapper>
    );
  }
}

export default AudioGreetings;
