import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import 'whatwg-fetch';
// import { googlePlacesConfig, GOOGLE_GEO_API_KEY } from '../envConfig';

import {
  RESET_ERROR_STATE,
  USER_INPUT_CHANGED,
  USER_LOCATION_INPUT_CHANGED,
} from './types';

/********************************************
  Form Actions
*********************************************/

export const userInputChanged = ({ prop, value }) => ({
  type: USER_INPUT_CHANGED,
  payload: { prop, value }
});

export const userLocationInputChanged = ({ prop, value }) => ({
  type: USER_LOCATION_INPUT_CHANGED,
  payload: { prop, value }
});

export const resetErrorState = () => {
  // console.log('Action resetErrorState');
  return {
    type: RESET_ERROR_STATE
  };
};
