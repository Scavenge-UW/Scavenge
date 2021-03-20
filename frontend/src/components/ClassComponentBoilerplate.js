import React, { Component } from 'react';

class ClassComponentBoilerplate extends Component {
  constructor(props) {
    super(props);
  }

  getName(){
    return "ClassComponentBoilerplate"
  }
  render() {
    return (
      <h1>
        Hello, my name is <strong>{this.getName()}</strong>.
      </h1>
    );
  }
}

export default ClassComponentBoilerplate;