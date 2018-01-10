import React from 'react';
//import { AsyncStorage } from 'react-native';
//import SocketIOClient from 'socket.io-client';
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
      channel: this.props.channel
    }
    this.props.socket.emit('message', message);
    this.setState({ textInput: '' });
  }

  render() {
    return (
      <div>
        <InputText 
          onChange={this.changeTextInput}
          value={this.state.textInput} />
        <button 
          onClick={this.handleSend} >
          Send
        </button>
      </div>
    );
  }
}