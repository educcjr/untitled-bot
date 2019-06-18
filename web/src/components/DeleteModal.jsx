import React from 'react';

export class DeleteModal extends React.Component {
  render () {
    const {
      name,
      deleteAudio
    } = this.props;

    return (
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
              <p>Delete {name} file?</p>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-primary'
                style={{cursor: 'pointer'}}
                onClick={deleteAudio}>Delete</button>
              <button
                type='button'
                className='btn btn-secondary'
                style={{cursor: 'pointer'}}
                data-dismiss='modal'>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteModal;
