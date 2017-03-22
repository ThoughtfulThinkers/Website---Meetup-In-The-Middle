import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  MEETUP_CHANGED,
  ADD_MEETUP,
  ADD_MEETUP_SUCCESS,
  SET_CURRENT_MEETUP,
  EDIT_MEETUP,
  EDIT_MEETUP_SUCCESS,
  RESET_MEETUP
} from './types';
import { getUser, pushMeetup, updateMeetup, setStatus, removeGuest, removeMeetup } from './firebase-functions/MeetupFormActions';

export const meetupChange = (prop, value) => {
  return {
    type: MEETUP_CHANGED,
    prop,
    value
  };
};

export const addMeetup = (meetupDetails) => {
  return (dispatch) => {
  dispatch({ type: ADD_MEETUP });

  const currentUser = getUser();
  if (!currentUser) {
    return Actions.login();
  }
  const userId = currentUser.uid;

  const meetup = {
    ...meetupDetails,
    chat: {},
    vote: {},
    users: {},
    location: '',
    status: 'created',
    user: userId,
    attendingNames: {},
  };
  return pushMeetup(meetup)
    .then(({ key }) => {
      dispatch({ type: ADD_MEETUP_SUCCESS });
      meetup.uid = key;
      dispatch(setCurrentMeetup(meetup));
      Actions.rsvp({ type: 'reset', meetup });
    })
    .catch((err) => console.log(err));
  };
};

export const setCurrentMeetup = (meetup) => {
  return {
    type: SET_CURRENT_MEETUP,
    meetup
  };
};

export const meetupEdit = (meetup) => {
  return (dispatch) => {
  dispatch({ type: EDIT_MEETUP });
  //const { currentUser } = firebase.auth();
  const { name, description, start, end, state, venue, voteStart, voteEnd } = meetup;
  const updates = {};
  updates['/name'] = name;
  updates['/description'] = description;
  updates['/start'] = start;
  updates['/end'] = end;
  updates['/state'] = state;
  updates['/venue'] = venue;
  updates['/voteStart'] = voteStart;
  updates['/voteEnd'] = voteEnd;
  updates['/status'] = 'created';

  return updateMeetup(meetup.uid, updates)
    .then(() => {
      dispatch({ type: EDIT_MEETUP_SUCCESS });
      Actions.meetups({ type: 'reset' });
    })
    .catch((err) => console.log(err));
  };
};

export const changeStatus = (meetup, status) => {
  return (dispatch) => {
    return setStatus(meetup.uid, status)
      .then(() => {
        dispatch({
            type: MEETUP_CHANGED,
            prop: 'status',
            value: status });
      })
      .then(() => {
        Actions.meetup({ type: 'refresh' });
      })
      .catch((err) => console.log(err));
    };
  };

  export const resetMeetup = () => {
    return {
      type: RESET_MEETUP
    };
  };

  export const deleteMeetup = (meetupId, users) => {
    return dispatch => {
      dispatch({ type: EDIT_MEETUP });

      const removeUsers = users.map(user => {
        return removeGuest(meetupId, user);
      });
      return Promise.all(removeUsers)
      .then(() => {
        return removeMeetup(meetupId)
        .then(() => {
            dispatch({ type: RESET_MEETUP });
          });
      });
    };
  };
