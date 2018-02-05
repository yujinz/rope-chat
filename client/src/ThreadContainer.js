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
  visibility: ${props => props.background==='white'? 'hidden':'visible'}
`;

export class ThreadContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let threadId;
    if (!this.props.threadId) { //this message is the start of a new thread
      threadId = this.props.messageId;
    }
    else {
      threadId = this.props.threadId;
    }
    this.props.replyToThread(threadId);
    //console.log(threadId);
  }
  
  render() {
    return (
      <span>
        {this.props.threadId &&
          // TODO: threadId==MessageId: show different icon  
          <ThreadBtn 
            backgroundColor={this.props.getThreadColor(this.props.threadId)}
            onClick={this.handleClick} />
        }
        {!this.props.threadId && (this.props.threadReplying===this.props.messageId) &&
          <ThreadBtn 
            backgroundColor={this.props.getThreadColor(this.props.messageId) } /> 
        }
        {!this.props.threadId && (this.props.threadReplying!==this.props.messageId) &&
          <ThreadCreater onClick={this.handleClick}>
            <ThreadBtn />
          </ThreadCreater>
        }
      </span>
    );
  }
}

ThreadContainer.propTypes = {
  threadId: PropTypes.string,
  messageId: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
  getThreadColor: PropTypes.func.isRequired,
  replyToThread: PropTypes.func.isRequired,
  threadReplying: PropTypes.string
}