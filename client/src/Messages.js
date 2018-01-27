import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ThreadCreater = styled.span`
  vertical-align: middle;
`;

const ThreadBtn = styled.button.attrs({
  background: props => props.backgroundColor || 'white'
})`
  padding: 4px 6px;
  vertical-align: middle;
  background: ${props => props.background};
  ${ThreadCreater}:hover & {
    visibility: visible;
  }
  visibility: ${props => props.background=='white'? 'hidden':'visible'}
`;

export class Messages extends React.Component {
  render() {
    const messages = this.props.messages;
    let messages_list;
    if (messages) {
      messages_list = messages.map(message_obj => {
        const userId = message_obj.user;
        const username = this.props.users[userId].name;
        const threadId = message_obj.thread;        
        return (
          <li key={message_obj._id}>
            {threadId &&
              <ThreadBtn 
                backgroundColor={this.props.getThreadColor(threadId) } >
              </ThreadBtn>
            }
            {!threadId &&
              //<ThreadCreater >
              //  <ThreadBtn />
              //</ThreadCreater>
              <ThreadCreater>
                <ThreadBtn />
              </ThreadCreater>
            }
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
  getThreadColor: PropTypes.func.isRequired
}