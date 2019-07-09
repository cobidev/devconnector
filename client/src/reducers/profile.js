// Profile Reducer
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'GET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case 'PROFILE_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
