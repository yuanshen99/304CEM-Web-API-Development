import React, { Component } from 'react';
import './App.css';

const Greeting = props => {
  return <h1>{props.msg}</h1>;
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <Greeting msg="hi there" />
      </div>
    );
  }
}

export default App;
