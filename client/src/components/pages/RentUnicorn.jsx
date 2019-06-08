import React, { Component } from 'react';
import api from '../../api';

export default class RentUnicorn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleClick(e) {
    e.preventDefault();
    console.log(this.state.name, this.state.description);
    let data = {
      name: this.state.name
    };
    api
      .rentUnicorn(data)
      .then(result => {
        console.log('SUCCESS!');
        this.setState({
          message: `Your unicorn '${this.state.name}' has been rented`
        });
        setTimeout(() => {
          this.setState({
            message: null
          });
        }, 2000);
      })
      .catch(err => this.setState({ message: err.toString() }));
  }
  render() {
    return (
      <div className='RentUnicorn'>
        <h2>Rent unicorns!</h2>
        <form>
          Name:{' '}
          <input
            type='text'
            value={this.state.name}
            name='name'
            onChange={this.handleInputChange}
          />{' '}
          <br />
          <br />
          <button onClick={e => this.handleClick(e)}>Rent it!</button>
        </form>
        {this.state.message && <div className='info'>{this.state.message}</div>}
      </div>
    );
  }
}
