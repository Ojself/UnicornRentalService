import React, { Component } from 'react';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Unicorns from './pages/Unicorns';

import Secret from './pages/Secret';
import Login from './pages/Login';
import Signup from './pages/Signup';
import api from '../api';
import logo from '../logo.svg';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unicorns: []
    };
  }

  handleLogoutClick(e) {
    api.logout();
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Unicorn rental service</h1>
          <NavLink to='/' exact>
            Home
          </NavLink>
          <NavLink to='/unicorns'>Unicorns</NavLink>
          {!api.isLoggedIn() && <NavLink to='/signup'>Signup</NavLink>}
          {!api.isLoggedIn() && <NavLink to='/login'>Login</NavLink>}
          {api.isLoggedIn() && (
            <Link to='/' onClick={e => this.handleLogoutClick(e)}>
              Logout
            </Link>
          )}
          <NavLink to='/secret'>Secret</NavLink>
        </header>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/unicorns' component={Unicorns} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
          <Route path='/secret' component={Secret} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}
