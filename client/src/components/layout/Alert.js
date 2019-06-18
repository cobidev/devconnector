import React from 'react';
import { connect } from 'react-redux';

const Alert = props =>
  // Check if Alert State is not empty
  props.alerts !== null &&
  props.alerts.length > 0 &&
  // Return Alert JSX
  props.alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

// Get Alert State from Store & pass in to this component via props
const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
