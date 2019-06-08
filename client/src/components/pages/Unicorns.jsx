import React, { Component } from 'react';
import api from '../../api';

export default class Unicorns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unicorns: []
    };
  }
  render() {
    return (
      <div className='Unicorns'>
        <h2>List of unicorns</h2>
        {this.state.unicorns.map((u, i) => (
          <li key={i}>{u.name}</li>
        ))}
      </div>
    );
  }
  componentDidMount() {
    api
      .getUnicorns()
      .then(unicorns => {
        console.log(unicorns);
        this.setState({
          unicorns: unicorns
        });
      })
      .catch(err => console.log(err));
  }
}
