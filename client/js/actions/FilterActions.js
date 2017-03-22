import { Actions } from 'react-native-router-flux';
import {
  SET_TEXT,
  SET_LOCATION
} from './types';

export const setText = (text) => {
  return {
    type: SET_TEXT,
    payload: text
  };
};

export const setLocation = (location) => {
  return {
    type: SET_LOCATION,
    payload: location
  };
};
