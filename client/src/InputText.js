import React from 'react';
//import { AsyncStorage } from 'react-native';
//import SocketIOClient from 'socket.io-client';

export class InputText extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextInput = this.handleTextInput.bind(this);
  }
  
  handleTextInput(e) {
    const textInput = e.target.value;
    this.props.onChange(textInput);
  }
  
  render() {
    return (
        <input type="text" 
          value={this.props.value} //controlled component
          onChange={this.handleTextInput} />
    );
  }
}