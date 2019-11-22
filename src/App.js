import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
const serverAddress = 'http://localhost:9100';

class App extends Component {

  render() {
    constructor(Props) {
      super(props)
      this.socket = null;
      this.state = {
        mouseX: 0,
        mouseY: 0,
        prevX: 0,
        prevY: 0,
        direction: null,
        cursors: [],
        name: '',
        loaded: false

      }
    }

    handleJoin = (e) => {
      fetch(serverAddress + '/create_user', {
        body: JSON.stringify({
          name: this.state.name
        }),
        method: 'post',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
        if(json.success) {
          localStorage.sessionKey = json.sessionKey;
          this.setState({loaded: true});
        }
      });
    }

    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
