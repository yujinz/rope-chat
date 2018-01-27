import React from 'react';
import PropTypes from 'prop-types';

import {InputText} from './InputText'

export class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: ''
    };

    this.handleSend = this.handleSend.bind(this);
    this.changeTextInput = this.changeTextInput.bind(this);
  }
  
  changeTextInput(newTextInput) {
    this.setState({ textInput: newTextInput });
  } 
  
  handleSend() {
    if (this.state.textInput === '') return;
    const message = {
      text: this.state.textInput,
      user: this.props.user,
      createdAt: new Date(),
      thread: Math.floor(Math.random()*101),
      channel: this.props.channel
    }
    this.props.socket.emit('message:new', message);
    this.setState({ textInput: '' });
  }

  render() {
    return (
      <div>
        <InputText 
          onChange={this.changeTextInput}
          onSubmit={this.handleSend}
          value={this.state.textInput} />
        <button 
          onClick={this.handleSend} >
          Send
        </button>
      </div>
    );
  }
}

InputForm.propTypes = {
  user: PropTypes.string.isRequired,
  channel: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  getThreadColor: PropTypes.func.isRequired
}