import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({ auth, currentProfile, getCurrentProfile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  // Print spinner if current profile is loading
  return currentProfile.loading && currentProfile.profile === null ? (
    <i className='fa fa-spinner fa-spin fa-4x' />
  ) : (
    // Print Dashboard page
    <section>
      <h1 className='large text-primary'>Dashboard</h1>

      <p className='lead'>
        <i className='fas fa-user' /> Welcome {auth.user && auth.user.name}
      </p>

      {currentProfile.profile !== null ? (
        <>has</>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create/profile' className='btn btn-primary my-1'>
            Create profile
          </Link>
        </>
      )}
    </section>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  currentProfile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
