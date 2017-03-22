import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { googlePlacesConfig } from '../envConfig';
import {
        CHANGE_RSVP,
        SET_RSVP,
        SET_RSVP_SUCCESS,
        DELETE_RSVP_SUCCESS,
        } from '../actions/types';
import { userMeetupsFetch } from './MeetupActions';
import {
          getUser,
          setGuest,
          setMeetup,
          updateGuest,
          updateMeetup,
          removeGuest,
          removeMeetup,
          updateStatus,
          setAttending,
          removeAttending
        } from './firebase-functions/RsvpActions';

const { apiKey } = googlePlacesConfig;

export const changeRSVP = (lat, lon) => {
  return dispatch => {
    const search = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    return fetch(search)
    .then(response => response.json())
    .then((data) => {
      const address = data.results[0].formatted_address;
      dispatch({
        type: CHANGE_RSVP,
        lat,
        lon,
        address
      });
    })
    .catch(err => console.log(err));
  };
};

export const setRsvp = (lat, lon, meetupId, users, name) => {
  return (dispatch) => {
    dispatch({ type: SET_RSVP });

    const currentUser = getUser();
    if (!currentUser) {
      Actions.login();
      return;
    }

    const userId = currentUser.uid;
    const guest = {
      uid: userId,
      name,
      lat,
      lon
    };

    return setGuest(meetupId, userId, guest)
    .then(() => {
      const currentMeetup = { lat, lon, uid: meetupId };
      return setMeetup(userId, currentMeetup);
    })
    .then(() => {
      return setAttending(meetupId, userId, name);
    })
    .then(() => {
      dispatch({ type: SET_RSVP_SUCCESS });
      Actions.meetups({ type: 'reset' });
    })
    .catch((err) => console.log(err));
  };
};

export const editRsvp = (lat, lon, meetupId, users, name) => {
  return (dispatch) => {
    dispatch({ type: SET_RSVP });

    const currentUser = getUser();
    if (!currentUser) {
      Actions.login();
      return;
    }

    const userId = currentUser.uid;
    const guest = {
      uid: userId,
      name,
      lat,
      lon
    };

    const updates = {};
    updates[`/${userId}`] = guest;

    return updateGuest(meetupId, updates)
    .then(() => {
      const currentMeetup = { lat, lon, uid: meetupId };
      return updateMeetup(userId, currentMeetup)
      .then(() => {
        dispatch({ type: SET_RSVP_SUCCESS });
        Actions.meetups({ type: 'reset' });
      });
    })
    .catch((err) => console.log(err));
  };
};

export const deleteRsvp = (meetup) => {
  return (dispatch) => {
    dispatch({ type: SET_RSVP });

    const currentUser = getUser();
    if (!currentUser) {
      Actions.login();
      return;
    }
    const meetupId = meetup.uid;
    const userId = currentUser.uid;

    return removeGuest(meetupId, userId)
      .then(() => {
        return removeMeetup(meetupId, userId);
      })
      .then(() => {
        return updateStatus(meetupId);
      })
      .then(() => {
        return removeAttending(meetupId, userId);
      })
      .then(() => {
        const newUsers = meetup.users;
        delete newUsers[userId];
        const newMeetup = meetup;
        newMeetup.users = newUsers;
        dispatch({ type: DELETE_RSVP_SUCCESS, meetup: newMeetup, id: meetupId });
        Actions.meetups({ type: 'reset' });
      })
      .catch(err => console.log(err));
    };
  };

  export const rsvpLate = (meetupId, name) => {
    return (dispatch) => {
      dispatch({ type: SET_RSVP });

      const currentUser = getUser();
      if (!currentUser) {
        Actions.login();
        return;
      }

      const userId = currentUser.uid;

      const currentMeetup = { uid: meetupId };
      return setMeetup(userId, currentMeetup)
      .then(() => {
        return setAttending(meetupId, userId, name);
      })
      .then(() => {
        dispatch({ type: SET_RSVP_SUCCESS });
        Actions.meetups({ type: 'reset' });
      })
      .catch((err) => console.log(err));
    };
  };

export const deleteRsvpLate = (meetup) => {
  return (dispatch) => {
    dispatch({ type: SET_RSVP });

    const currentUser = getUser();
    if (!currentUser) {
      Actions.login();
      return;
    }
    const meetupId = meetup.uid;
    const userId = currentUser.uid;

    return removeMeetup(meetupId, userId)
      .then(() => {
        return removeAttending(meetupId, userId);
      })
      .then(() => {
        const newAttend = meetup.attendingNames;
        delete newAttend[userId];
        const newMeetup = meetup;
        newMeetup.attendingNames = newAttend;
        dispatch({ type: DELETE_RSVP_SUCCESS, meetup: newMeetup, id: meetupId });
        Actions.meetups({ type: 'reset' });
      })
      .catch(err => console.log(err));
    };
};
