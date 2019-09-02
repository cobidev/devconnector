import axios from 'axios';
import { setAlert } from './alert';

// ACTION::Get current user profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: 'GET_PROFILE',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// ACTION::Create or Update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    // prepare headers for post request
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // POST profile data
    const res = await axios.post('/api/profile', formData, config);

    // Dispatch profile into redux state
    dispatch({
      type: 'GET_PROFILE',
      payload: res.data
    });

    // if edit param is false, dispatch diferent message
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    // redirect if edit param is false
    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// ACTION::Add Experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    // prepare headers for post request
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // PUT experience data
    const res = await axios.put('/api/profile/experience', formData, config);

    // Dispatch experience into redux state
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: res.data
    });

    // if edit param is false, dispatch diferent message
    dispatch(setAlert('Experience Added', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// ACTION::Add Education
export const addEducation = (formData, history) => async dispatch => {
  try {
    // prepare headers for post request
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // PUT education data
    const res = await axios.put('/api/profile/education', formData, config);

    // Dispatch education into redux state
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: res.data
    });

    // if edit param is false, dispatch diferent message
    dispatch(setAlert('Education Added', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
