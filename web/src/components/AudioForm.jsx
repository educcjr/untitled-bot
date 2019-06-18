import React from 'react';

// Styles
import { UntitledForm, UntitledSelect } from '../styles/layout/audioForm';
import { FileUpload, FilePicker, Submit } from '../styles/layout/fileUpload';

export class AudioForm extends React.Component {
  render () {
    const {
      onSubmit,
      onUserChange,
      userDiscordId,
      users,
      onFileChange
    } = this.props;

    return (
      <UntitledForm onSubmit={onSubmit}>
        <div>
          <UntitledSelect
            onChange={onUserChange}
            value={userDiscordId}>
            {users.map((user, index) => (
              <option key={index} value={user.discordId}>{user.name}</option>
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
