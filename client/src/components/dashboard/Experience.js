import React from 'react';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile';
import { connect } from 'react-redux';

const Experience = ({ experience, deleteExperience }) => {
  const experiencesJSX = experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className='hide-sm'>{exp.title}</td>
      <td className='hide-sm'>
        <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
        {!exp.to ? 'Now' : <Moment>{exp.to}</Moment>}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteExperience(exp._id)}>
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{experiencesJSX}</tbody>
      </table>
    </>
  );
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
