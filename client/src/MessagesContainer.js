import React from 'react';
import PropTypes from 'prop-types';
import SocketIOClient from 'socket.io-client';

import { Messages } from './Messages';

export class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }

    this.onReceivedMessage = this.onReceivedMessage.bind(this);    
    this.props.socket.on('message:concat', this.onReceivedMessage);
  }

  componentDidMount() {
    this.props.socket.emit('message:fetch', this.props.channel);
  }

  onReceivedMessage(newMessages) {
    const currMessages = this.state.messages;
    this.setState({ messages: currMessages.concat(newMessages) });
  }

  render() {
    return <Messages messages={this.state.messages} />;
  }
}

MessagesContainer.propTypes = {
  channel: PropTypes.object.isRequired,
  socket: PropTypes.instanceOf(SocketIOClient).isRequired
}