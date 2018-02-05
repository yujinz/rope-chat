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
      users: {},
      threadReplying: null
    };

    this.closeUnameModal = this.closeUnameModal.bind(this);
    this.onUserJoined = this.onUserJoined.bind(this);
    this.getThreadColor = this.getThreadColor.bind(this);
    this.setThreadReplying = this.setThreadReplying.bind(this);
    this.clearThreadReplying = this.clearThreadReplying.bind(this);

    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient('http://localhost:3001');   
    this.socket.on('user:concat', (newUser) => this.onUserJoined(newUser));
    
    this.threadColors = ['#96ceb4', '#b8a9c9', '#ffcc5c', '#ff6f69', '#87bdd8',
      '#FF6E84', '#55C1FF', '#00A651', '#17CEA6', '#FFCE1C', '#008BDD', '#8848BA'];
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

  getThreadColor(threadId) {
    if (threadId) {
      const hashCode = function(str) { // Credit to: github.com/darkskyapp/string-hash
        var hash = 5381, i = str.length;
        while(i)  hash = (hash * 33) ^ str.charCodeAt(--i);
        return hash >>> 0;
      };
      //console.log(hashCode(threadId.toString()));
      return this.threadColors[hashCode(threadId.toString()) % this.threadColors.length];
    }
    return 'white';
  }
  
  setThreadReplying(threadId) {
    this.setState({ threadReplying: threadId });
  }

  clearThreadReplying() {
    this.setState({ threadReplying: null });
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
          socket={this.socket}
          getThreadColor={this.getThreadColor}
          threadReplying={this.state.threadReplying}
          replyToThread={this.setThreadReplying} />
        <InputForm
          user={this.state.userId}
          channel={this.state.channelId}
          socket={this.socket}
          getThreadColor={this.getThreadColor}
          threadReplying={this.state.threadReplying} />
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