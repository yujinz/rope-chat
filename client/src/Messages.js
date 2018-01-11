import React from 'react';
import PropTypes from 'prop-types';

export class Messages extends React.Component {
  render() {
    const messages = this.props.messages;
    let messages_list;
    if (messages) {
      messages_list = messages.map(message_obj => {        
        return (
          <li key={message_obj._id}>
            <b>{message_obj.user}: </b>
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
  messages: PropTypes.array.isRequired
}