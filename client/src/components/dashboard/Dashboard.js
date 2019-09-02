import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { connect } from 'react-redux';

const Dashboard = ({
  auth,
  currentProfile,
  getCurrentProfile,
  deleteAccount
}) => {
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
        <>
          <DashboardActions />
          <Experience experience={currentProfile.profile.experience} />
          <Education education={currentProfile.profile.education} />

          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus'></i> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
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
  { getCurrentProfile, deleteAccount }
)(Dashboard);
