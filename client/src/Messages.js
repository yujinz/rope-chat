import React from 'react';
import PropTypes from 'prop-types';

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
  users: PropTypes.object.isRequired
}