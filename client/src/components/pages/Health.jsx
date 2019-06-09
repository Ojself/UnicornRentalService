import React, { Component } from 'react';
import api from '../../api';

export default class Secret extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,

      message: null
    };
  }
  render() {
    let health = this.state.data;

    return health ? (
      <div className='Health'>
        <h2>Health of the application</h2>
        <ul>
          <li>Status: {health.status}</li>
          <li>MongoDB: {health.dbStatus}</li>
          <li>Uptime: {Math.floor(health.upTime)} s</li>
          <li>Heaptotal: {health.memoryUsage.heapTotal}</li>
          <li>Platform: {health.platform}</li>
        </ul>

        {this.state.message && (
          <div className='info info-danger'>{this.state.message}</div>
        )}
      </div>
    ) : (
      <div>Analyzing your server, please wait..</div>
    );
  }
  componentDidMount() {
    api
      .getHealth()
      .then(data => this.setState({ data }))
      .catch(err => this.setState({ message: err.toString() }));
  }
}
