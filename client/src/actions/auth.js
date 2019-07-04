import axios from 'axios';
import { setAlert } from './alert';
// Utils
import setAuthToken from '../utils/setAuthToken';

// Load User Action
export const loadUser = () => async dispath => {
  // check if token exist on local Storage, if true: set that token into x-auth-token Header
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    // get user data by sendin the x-auth-token in Header
    const res = await axios.get('/api/auth');

    dispath({
      type: 'USER_LOADED',
      payload: res.data
    });
  } catch (err) {
    dispath({
      type: 'AUTH_ERROR'
    });
  }
};

// Register User Action
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    // register user
    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data
    });
    // load user
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'REGISTER_FAIL'
    });
  }
};

// Login User Action
export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    // login user
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data
    });
    // load user
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'LOGIN_FAIL'
    });
  }
};

// Logout / Clear Profile Action
export const logout = () => dispatch => {
  dispatch({
    type: 'LOGOUT'
  });
};
