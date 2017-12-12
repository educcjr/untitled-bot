import React from 'react';

// Styles
import {
  UntitledForm,
  UntitledSelect,
  UntitledOption,
} from '../styles/layout/audioForm';
import { FileUpload, FilePicker, Submit } from '../styles/layout/fileUpload';

export class AudioForm extends React.Component {
  render() {
    const onSubmit = this.props.onSubmit,
          onUserChange = this.props.onUserChange,
          userDiscordId = this.props.userDiscordId,
          users = this.props.users,
          onFileChange = this.props.onFileChange;

    return (
      <UntitledForm onSubmit={onSubmit}>
        <div>
          <UntitledSelect
            onChange={onUserChange}
            value={userDiscordId}>
            {users.map((user, index) => (
              <UntitledOption key={index} value={user.discordId}>{user.name}</UntitledOption>
            ))}
          </UntitledSelect>
        </div>

        <div>
          <FileUpload
            type='file'
            accept='audio/*'
            onChange={onFileChange}
          />
          <FilePicker>Choose an audio</FilePicker>
        </div>

        <div>
          <Submit type='submit' />
        </div>

      </UntitledForm>
    );
  }
}

export default AudioForm;
