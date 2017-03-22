import { Actions } from 'react-native-router-flux';
import 'whatwg-fetch';
import { GOOGLE_GEO_API_KEY } from '../envConfig';

import {
  FETCH_GEOLOCATION_BY_FULL_ADDRESS_SUCCESS
} from './types';

/**************************************************
  Google
**************************************************/
export const fetchGeoLocationByFullAddress = (street, city, state) => dispatch => {
  const fullAddress = `${street},${city},${state}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${GOOGLE_GEO_API_KEY}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log('location: ', data.results[0].geometry.location);
      const location = data.results[0].geometry.location;
      dispatch({ type: FETCH_GEOLOCATION_BY_FULL_ADDRESS_SUCCESS, payload: location });
    })
    .catch(error => console.log('fetchGeoLocationByFullAddress error: ', error));
};
