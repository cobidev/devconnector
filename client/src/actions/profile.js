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

// ACTION::Delete Experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: 'UPDATE_PROFILE',
      payload: res.data
    });

    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// ACTION::Delete Education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: 'UPDATE_PROFILE',
      payload: res.data
    });

    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// ACTION:: Delete Account & Profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      const res = await axios.delete(`/api/profile/`);

      dispatch({ type: 'CLEAR_PROFILE' });
      dispatch({ type: 'DELETE_ACCOUNT' });

      dispatch(setAlert('Your account has been permanantly deleted'));
    } catch (err) {
      dispatch({
        type: 'PROFILE_ERROR',
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
