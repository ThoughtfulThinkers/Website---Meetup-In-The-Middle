import {
  AUTH_INPUT_CHANGED,
  EMAIL_CHANGED,
  LOAD_AUTHENTICATED_USER_STATE_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  PASSWORD_CHANGED,
  PASSWORD_RESET_FAILED,
  RESET_AUTH_ERROR_STATE,
  SET_LOGIN_STATUS,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  error: '',
  loading: false,
  loggedIn: false,
  newEmail: '',
  newPassword: '',
  confirmPassword: '',
  authError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_INPUT_CHANGED: {
      // example: action.payload = {prop: 'email', value: 'test@test.com'}
      // key interpolation -> [prop]
      const { prop, value } = action.payload;
      return { ...state, [prop]: value };
    }

    case SET_LOGIN_STATUS: {
      return { ...state, loggedIn: action.payload };
    }

    case EMAIL_CHANGED:
      return { ...state, email: action.payload };

    case LOAD_AUTHENTICATED_USER_STATE_SUCCESS: {
      const { email } = action.payload;
      return { ...state, email };
    }

    case LOGIN_USER:
      // console.log('LOGIN_USER REDUCER: ', action.payload);
      return { ...state, loading: true, authError: '' };
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case LOGIN_USER_FAIL:
      return { ...state, authError: 'Authentication Failed.', password: '', loading: false };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case PASSWORD_RESET_FAILED:
      return { ...state, authError: 'Email Address Invalid or Account does not exist' };
    case RESET_AUTH_ERROR_STATE:
      console.log('RESET_AUTH_ERROR_STATE called');
      return { ...state, authError: '', loading: false };
    default:
      return state;
  }
};
