import React from 'react';

/**
 * AudioForm
 */
export class AudioForm extends React.Component {
  render() {
    const onSubmit = this.props.onSubmit,
          onUserChange = this.props.onUserChange,
          userDiscordId = this.props.userDiscordId,
          users = this.props.users,
          onFileChange = this.props.onFileChange;

    return (
      <form
        style={{width: '300px', textOverflow: 'ellipsis'}}
        onSubmit={onSubmit}>

        <div className='form-group'>
          <select
            className='form-control'
            onChange={onUserChange}
            value={userDiscordId}>
            {users.map((user, index) => (
              <option key={index} value={user.discordId}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <input
            className='form-control-file'
            type='file'
            accept='audio/*'
            onChange={onFileChange}
            style={{width: '100%'}} />
        </div>

        <div className='form-group'>
          <input className='btn btn-primary' type='submit' />
        </div>

      </form>
    );
  }
}

export default AudioForm;
