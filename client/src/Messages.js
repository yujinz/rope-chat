import React from 'react';
import PropTypes from 'prop-types';
import { ThreadContainer } from './ThreadContainer';

export class Messages extends React.Component {
  render() {
    const messages = this.props.messages;
    let messages_list;
    if (messages) {
      messages_list = messages.map(message_obj => {
        const userId = message_obj.user;
        const username = this.props.users[userId].name;
        return (
          <li key={message_obj._id}>
            <ThreadContainer
              threadId={message_obj.thread}
              messageId={message_obj._id}
              socket={this.props.socket}
              getThreadColor={this.props.getThreadColor}
              threadReplying={this.props.threadReplying}
              replyToThread={this.props.replyToThread} />
            <b>{username}: </b>
            {message_obj.text}
          </li>
        );        
      })
    }
    return (
      <div>
        {messages_list}
      </div>      
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
  users: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  getThreadColor: PropTypes.func.isRequired,
  replyToThread: PropTypes.func.isRequired,
  threadReplying: PropTypes.string
}