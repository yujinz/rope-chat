import React from 'react';
import { AsyncStorage } from 'react-native';
import SocketIOClient from 'socket.io-client';

import { InputForm } from './InputForm'
import { MessagesContainer } from './MessagesContainer'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      channelId: 1
    };

    this.determineUser = this.determineUser.bind(this);     

    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient('http://localhost:3001');
    
    this.determineUser();
  }

  /**
   * When users join the chatroom, check if they are an existing user.
   * If they aren't, then ask the server for a userId.
   * Set the userId to the component's state.
   */
  async determineUser() {
    try {
      const userId = await AsyncStorage.getItem('@userId');
      // If there isn't a stored userId, then fetch one from the server.
      if (!userId) {
        this.socket.emit('user:join', null);
        this.socket.on('user:join', (userId) => {
          AsyncStorage.setItem('@userId', userId);
          this.setState({ userId : userId });
        });
      } else {
        this.socket.emit('user:join', userId);
        this.setState({ userId : userId });
      }
    }
    catch(e) {
        alert(e)
    }
  }

  render() {
    const user = this.state.userId || -1;
    
    return (
      <div>
        <h1>
          Hi, {user}
        </h1>
        <MessagesContainer
          channel={this.state.channelId}
          socket={this.socket}/>
        <InputForm
          user={this.state.userId}
          channel={this.state.channelId}
          socket={this.socket}/>
      </div>
    );
  }
}

export default App;