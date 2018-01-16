import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
//import SocketIOClient from 'socket.io-client';

import {InputText} from './InputText'

Modal.setAppElement(document.getElementById('root'));

export class UsernameModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unameInput: ''
    };
    
    this.changeUnameInput = this.changeUnameInput.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleModalCloseRequest = this.handleModalCloseRequest.bind(this);
    this._setUsername = this._setUsername.bind(this);
  }

  changeUnameInput(newUnameInput) {
    this.setState({ unameInput: newUnameInput });
  } 
  
  handleSend() {
    if (this.state.unameInput === '') return;
    this._setUsername(this.state.unameInput);
    this.props.closeModal();
  }

  handleModalCloseRequest() {
    if (this.state.unameInput === '') {
      const default_uname = this.props.userId.substr(-6);
      this._setUsername(default_uname);
    }
    this.props.closeModal();
  }

  _setUsername(uname) {
    const user = {
      _id: this.props.userId,
      name: uname
    }
    this.props.socket.emit('user:set-name', user);
  }

  render() {
    return (
      <div>        
        <Modal
          className="Modal__Bootstrap modal-dialog"
          closeTimeoutMS={150}
          isOpen={this.props.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest} >
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">Please enter your name</h4>
            </div>
            <div className="modal-body">
              <p>Hello, </p>
              <InputText 
                onChange={this.changeUnameInput}
                onSubmit={this.handleSend}
                value={this.state.unameInput} />
              <button 
                onClick={this.handleSend} >
                OK
              </button>
            </div>            
          </div>
        </Modal>
      </div>  
    );
  }
}

UsernameModal.propTypes = {
  userId: PropTypes.string.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
}