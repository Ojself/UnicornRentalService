import React, { Component } from 'react';
import api from '../../api';

export default class Unicorns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unicorns: [],
      user: null,
      message: null
    };
  }
  componentDidMount() {
    api
      .getUnicorns()
      .then(unicorns => {
        this.setState({
          unicorns: unicorns
        });
      })
      .then(() => {
        api.getUser().then(user => {
          this.setState(user);
        });
      })
      .catch(err => console.log(err));
  }

  handleReturn(e) {
    e.preventDefault();
    api.returnUnicorn().then(result => {
      const userCopy = this.state.user;
      userCopy.currentUnicorn = '';

      console.log('SUCCESS!');
      this.setState({
        message: `Your Unicorn has been returned`,
        user: userCopy
      });
    });
    setTimeout(() => {
      this.setState({
        message: null
      });
    }, 3000);
  }

  handleClick(e) {
    e.preventDefault();
    let unicornId = e.target.value;

    api
      .rentUnicorn(unicornId)
      .then(result => {
        console.log('SUCCESS!');
        const copy = [...this.state.unicorns];
        const userCopy = this.state.user;
        userCopy.currentUnicorn = unicornId;

        copy.map(el => {
          return el._id === unicornId ? (el.isAvailable = false) : null;
        });
        this.setState({
          message: `Your unicorn has been rented`,
          unicorns: copy,
          user: userCopy
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
    let myUnicorn;
    if (this.state.user) {
      myUnicorn = this.state.user.currentUnicorn;
    }

    return (
      <div className='unicornswrapper'>
        {this.state.message ? (
          this.state.message && <div className='info'>{this.state.message}</div>
        ) : (
          <h2>Unicorns in our stall</h2>
        )}

        {this.state.unicorns.map((u, i) => (
          <div key={i} className='unicorn-card box'>
            <img src={u.avatar} alt={u.name} />
            <div>
              <strong>Name</strong>: {u.name} <br />
              <strong>Price</strong>: {u.price}$ <br />
              <strong>Resttime</strong>: {u.downTime} minutes <br />
              {myUnicorn === u._id ? (
                <button
                  className='btn enabled'
                  value={u._id}
                  onClick={e => this.handleReturn(e)}
                >
                  Return
                </button>
              ) : u.isAvailable ? (
                <button
                  value={u._id}
                  onClick={e => this.handleClick(e)}
                  className='btn enabled'
                >
                  {' '}
                  Rent me!
                </button>
              ) : (
                <button disabled className='btn disabled'>
                  Unavailable{' '}
                </button>
              )}
            </div>
          </div>
        ))}
        <p>
          Databases are wiped every day to ensure the return of our unicorns
        </p>
      </div>
    );
  }
}
