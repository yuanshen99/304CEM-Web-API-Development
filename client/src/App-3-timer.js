import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      now: 0
    };
  }

  componentDidMount() {
    var counter = 0;
    setInterval(() => {
      this.setState({ now: counter++ });
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.now}</h1>
      </div>
    );
  }
}

export default App;
