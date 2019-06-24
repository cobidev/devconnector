import React, { useState } from 'react';
// Router
import { Link, Redirect } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
import { login } from '../../actions/auth';

const Login = props => {
  /* State */
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // Destructure state values
  const { email, password } = formData;

  /* Event Handlers */

  // handle update State values when user type on input
  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  // handle form submit
  const onSubmit = async e => {
    e.preventDefault();

    props.login({ email, password });
  };

  /* Redirect if logged in */
  if (props.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign into Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
