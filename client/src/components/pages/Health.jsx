import React, { Component } from 'react';
import api from '../../api';

export default class Secret extends Component {
  constructor(props) {
    super(props);
    this.state = {
      health: null,
      message: null
    };
  }
  render() {
    return (
      <div className='Health'>
        <h2>Health of the application</h2>

        <div className='result'>{this.state.health}</div>

        {this.state.message && (
          <div className='info info-danger'>{this.state.message}</div>
        )}
      </div>
    );
  }
  componentDidMount() {
    api
      .getHealth()
      .then(data => this.setState({ secret: data.secret }))
      .catch(err => this.setState({ message: err.toString() }));
  }
}
