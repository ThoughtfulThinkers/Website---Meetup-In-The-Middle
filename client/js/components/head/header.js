import React from 'react';
import { Link } from 'react-router';

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-sm navbar-light bg-faded">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <Link className="navbar-brand" to="/">Meetup At</Link>
          <div className="collapse navbar-collapse" id="navMenu">
            <div className="navbar-nav justify-content-left">
              <Link className="nav-item nav-link" to="/">Home</Link>
            </div>
            <div className="navbar-nav justify-content-end">
              <Link className="nav-item nav-link" to="/">Login</Link>
              <Link className="nav-item nav-link" to="/">Sign Up</Link>
              <Link className="nav-item nav-link" to="/">Account</Link>
              <Link className="nav-item nav-link" to="/">Logout</Link>
            </div>
          </div>
        </nav>
    </div>
    )
  }
}
