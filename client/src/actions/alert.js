import uuid from 'uuid';

// Set Alert Action
export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
  // generate random id for alert
  const id = uuid.v4();

  // Create alert to alert state
  dispatch({
    type: 'SET_ALERT',
    payload: {
      msg,
      alertType,
      id
    }
  });
  // Remove alert from alert state
  setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout);
};
