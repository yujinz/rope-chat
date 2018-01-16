import React from 'react';
import SocketIOClient from 'socket.io-client';

import { InputForm } from './InputForm'
import { MessagesContainer } from './MessagesContainer'
import { UsernameModal } from './UsernameModal'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      channelId: 1,
      unameModalIsOpen: false,
      users: {}
    };

    this.closeUnameModal = this.closeUnameModal.bind(this);
    this.onUserJoined = this.onUserJoined.bind(this);

    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient('http://localhost:3001');   
    this.socket.on('user:concat', (newUser) =>  this.onUserJoined(newUser));   
  }

  componentDidMount() {
    this._determineUser();
    this._getAllUsers();
  }
  
  /**
   * When users join the chatroom, check if they are an existing user.
   * If they aren't, then ask the server for a userId.
   * Set the userId to the component's state.
   */
  _determineUser() {
    try {
      const userId = localStorage.getItem('userId');
      // If there isn't a stored userId, then fetch one from the server.
      if (!userId) {
        this.socket.emit('user:join', null);
        this.socket.on('user:new', (userId) => {
          localStorage.setItem('userId', userId);
          this.setState({ userId : userId });
        });
        this._openUnameModal();
      } else {
        this.socket.emit('user:join', userId);
        this.setState({ userId : userId });
      }
    }
    catch(e) {
        alert(e)
    }
  }

  _getAllUsers() {
    this.socket.emit('user:get-all');
    this.socket.on('user:get-all', (usersArr) => {
      var usersDict = usersArr.reduce(function(entry, obj) {
        entry[obj._id] = obj;
        return entry;
      }, {});
      this.setState({ users: usersDict });
    });
  }

  onUserJoined(newUser) {
    let users = this.state.users;
    users[newUser._id] = newUser;
    this.setState({ users: users });
    console.log(newUser.name + " joined");
  }

  _openUnameModal() {
    this.setState({unameModalIsOpen: true});
  }

  closeUnameModal() {
    this.setState({unameModalIsOpen: false});
  }

  render() {
    if (this.state.userId == null
      || !(this.state.userId in this.state.users))
      return (<div>loading...</div>);
    
    const username = this.state.users[this.state.userId].name;
    
    return (      
      <div>
        <h1>
          Hi, {username}
        </h1>
        <MessagesContainer
          channel={this.state.channelId}
          users={this.state.users}
          socket={this.socket} />
        <InputForm
          user={this.state.userId}
          channel={this.state.channelId}
          socket={this.socket} />
        <UsernameModal
          userId={this.state.userId}  
          modalIsOpen={this.state.unameModalIsOpen}
          closeModal={this.closeUnameModal}
          socket={this.socket} />                
      </div>
    );
  }
}

export default App;