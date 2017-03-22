import firebase from 'firebase';
import _ from 'lodash';

import {
  CHANGE_SEARCH,
  FETCH_MEETUPS,
  FETCH_MEETUPS_SUCCESS,
  FETCH_MEETUP_SUCCESS,
  FETCH_SEARCH_MEETUPS,
  FETCH_SEARCH_MEETUPS_SUCCESS,
  FETCH_USER_MEETUPS,
  FETCH_USER_MEETUPS_SUCCESS,
  USER_INPUT_CHANGED,
} from './types';

export const meetupsFetch = (city = 'Utah') => {
  return (dispatch) => {
    dispatch({ type: FETCH_MEETUPS });

    const ref = firebase.database().ref('/meetups');
    ref.orderByChild('state').equalTo(city).on('value', (snapshot) => {
      dispatch({ type: FETCH_MEETUPS_SUCCESS, payload: snapshot.val() });
    });
  };
};

export const userMeetupsFetch = () => {
    return (dispatch) => {
      dispatch({ type: FETCH_USER_MEETUPS });

      //return empty object if user not logged in
      const { currentUser } = firebase.auth();

      if (!currentUser) {
        return dispatch({ type: FETCH_USER_MEETUPS_SUCCESS, payload: {} });
      }

      //otherwise return the user's meetup ids; these are returned as a nested object
      firebase.database().ref(`/users/${currentUser.uid}/meetups`).on('value', (snapshot) => {
        let meetups = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid };
        });
        const events = {};
        meetups = meetups.map((meetup) => {
          return firebase.database().ref(`meetups/${meetup.uid}`).on('value', (snapshot2) => {
            events[meetup.uid] = snapshot2.val();
          });
        });
        Promise.all(meetups)
        .then(() => dispatch({ type: FETCH_USER_MEETUPS_SUCCESS, payload: events }));
      });
    };
  };

  export const changeSearch = (search) => {
    return { type: CHANGE_SEARCH, search };
  };

  export const meetupById = (id) => {
    return (dispatch) => {
      dispatch({ type: FETCH_SEARCH_MEETUPS });

      const ref = firebase.database().ref('/meetups');
      ref.orderByKey().equalTo(id).once('value')
      .then((snapshot) => {
        const response = snapshot.val();
        if (!response) {
          dispatch({
            type: USER_INPUT_CHANGED,
            payload: { prop: 'error', value: 'Meetup not found.' }
          });
        } else {
          const meetup = { ...response[id], uid: id };
          dispatch({ type: FETCH_SEARCH_MEETUPS_SUCCESS, payload: meetup });
          Actions.meetup();
        }
      });
    };
  };
