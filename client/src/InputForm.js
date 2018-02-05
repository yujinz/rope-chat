import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InputText } from './InputText'

const ThreadBtn = styled.button.attrs({
  background: props => props.backgroundColor || 'white'
})`
  padding: 4px 6px;
  vertical-align: middle;
  background: ${props => props.background};  
  visibility: ${props => props.background==='white'? 'hidden':'visible'}
`;

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
      thread: this.props.threadReplying,
      channel: this.props.channel
    }
    this.props.socket.emit('message:new', message);
    this.setState({ textInput: '' });
    if (this.props.threadReplying) this.props.clearThreadReplying();
  }

  render() {
    return (
      <div>
        <ThreadBtn 
          backgroundColor={this.props.getThreadColor(this.props.threadReplying)} />
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
  getThreadColor: PropTypes.func.isRequired,
  threadReplying: PropTypes.string,
  clearThreadReplying: PropTypes.func.isRequired
}