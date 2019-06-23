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

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data
    });
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
