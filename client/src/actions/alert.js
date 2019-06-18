import uuid from 'uuid';

// Set Alert Action
export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
  const id = uuid.v4();

  dispatch({
    type: 'SET_ALERT',
    payload: {
      msg,
      alertType,
      id
    }
  });

  setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout);
};
