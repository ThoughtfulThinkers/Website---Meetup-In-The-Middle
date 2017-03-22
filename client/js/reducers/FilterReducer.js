import {
  SET_TEXT,
  SET_LOCATION
} from '../actions/types';

const INITIAL_STATE = {
  location: 'New York',
  text: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_TEXT:
      return { ...state, text: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload, text: '' };
    default:
      return state;
  }
};
