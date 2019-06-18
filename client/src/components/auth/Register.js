import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  // Destructure state values
  const { name, email, password, password2 } = formData;

  // Event Handlers

  // handle update State values when user type on input
  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  // handle form submit
  const onSubmit = async e => {
    e.preventDefault();
    // password validation
    if (password !== password2) {
      console.log('Password do not match');
    } else {
      // create user from state
      const newUser = {
        name,
        email,
        password
      };

      try {
        // setup content type of the request
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        // set newUser to JSON
        const body = JSON.stringify(newUser);
        // post data to API
        const res = await axios.post('/api/users', body, config);

        // get response (token) from the user
        console.log(res.data);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
