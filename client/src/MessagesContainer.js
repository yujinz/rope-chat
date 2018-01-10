import React from 'react';
import { Messages } from './Messages';

export class MessagesContainer extends React.Component {
  /*
  constructor(props) {
    super(props);
  }
  */

  render() {
    return <Messages messages={this.props.messages} />;
  }
}