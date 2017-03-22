import 'whatwg-fetch';
import firebase from 'firebase';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { SET_CURRENT_MEETUP, SET_VOTE, MEETUP_CHANGED } from './types';
import { foursquareConfig, googlePlacesConfig } from '../envConfig';
import { setMeetup, firebaseUserVote, firebaseVenueVote, setLocation } from './firebase-functions/MapActions';

const { ID, SECRET } = foursquareConfig;
const { apiKey } = googlePlacesConfig;

export const createVoting = (lat, lon, meetup) => {
  if (!_.isEmpty(meetup.venues)) {
    return { type: SET_CURRENT_MEETUP, meetup };
  }
  const venueType = meetup.venue.id;
  return dispatch => {
    const search = `https://api.foursquare.com/v2/venues/explore?ll=${lat},${lon}&client_id=${ID}&client_secret=${SECRET}&sortByDistance=true&section=${venueType}&limit=10&v=20170201&m=foursquare`;
    return fetch(search)
    .then(response => response.json())
    .then(data => {
      let venues;
      let status;
      let newMeetup;
      if (!data.response.groups || data.response.groups.length === 0 || data.response.groups[0].items.length === 0) {
        const search2 = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
        fetch(search2)
        .then(response => response.json())
        .then((data2) => {
          let formattedAddress;
          if (!data2 || !data2.results || !data2.results[0] || !data2.results[0].formatted_address) {
            formattedAddress = 'Invalid Location';
          } else {
            formattedAddress = data2.results[0].formatted_address;
          }
          const location = {
            formattedAddress: [formattedAddress],
            lat,
            lon,
            name: formattedAddress,
            votes: 0
          };
          venues = { 0: location };
          status = 'location';
          newMeetup = { ...meetup, status, venues };
          setMeetup(newMeetup)
          .then(() => {
            dispatch({ type: SET_CURRENT_MEETUP, meetup: newMeetup });
            Actions.meetup({ type: 'refresh' });
          })
          .catch(err => console.log('create venues error', err));
        })
        .catch(err => console.log(err));
      } else {
        venues = {};
        status = 'voting';
        data.response.groups[0].items.forEach(item => {
          const { name, location, id } = item.venue;
          const { formattedAddress, lng } = location;
          venues[id] = { name, formattedAddress, lat: location.lat, lon: lng, votes: 0 };
        });
        newMeetup = { ...meetup, status, venues };
        setMeetup(newMeetup)
        .then(() => {
          dispatch({ type: SET_CURRENT_MEETUP, meetup: newMeetup });
          Actions.meetup({ type: 'refresh' });
        })
        .catch(err => console.log('create venues error', err));
      }
    })
    .catch(err => console.log(err));
  };
};

export const setVote = (meetupId, venueId, venueVote) => {
  return dispatch => {
    return firebaseUserVote(meetupId, venueId)
    .then(() => {
      firebaseVenueVote(meetupId, venueId, venueVote)
      .then(() => {
        dispatch({ type: SET_VOTE, venueId, vote: venueVote });
        Actions.meetup({ type: 'refresh' });
      });
    })
    .catch(err => console.log(err));
  };
};

export const voteChange = (meetupId, venueId, venueVote) => {
  return dispatch => {
    const { currentUser } = firebase.auth();

    //get old vote location
    let userPreviousVote;
    firebase.database().ref(`/users/${currentUser.uid}/meetups/${meetupId}/vote`)
    .on('value', (snapshot) => {
      userPreviousVote = snapshot.val();
    });

    //get old venue vote count
    let oldVenueCount;
    firebase.database().ref(`/meetups/${meetupId}/venues/${userPreviousVote}/votes`)
    .on('value', (snapshot) => {
      oldVenueCount = snapshot.val();
    });

    //lower old vote count, raise new vote count, replace user venue id
    oldVenueCount -= 1;
    const updates = {};
    updates[`/users/${currentUser.uid}/meetups/${meetupId}/vote`] = venueId;
    updates[`/meetups/${meetupId}/venues/${userPreviousVote}/votes`] = oldVenueCount;
    updates[`/meetups/${meetupId}/venues/${venueId}/votes`] = venueVote;

    firebase.database().ref().update(updates).then(() => {
      dispatch({ type: SET_VOTE, venueId, vote: venueVote });
      Actions.meetup({ type: 'refresh' });
    });
  };
};

export const changeLocation = (location, meetupId) => {
  return (dispatch) => {
    return setLocation(meetupId, location)
    .then(() => {
      dispatch({
        type: MEETUP_CHANGED,
        prop: 'location',
        value: location });
        Actions.meetup({ type: 'refresh' });
      })
      .catch((err) => console.log(err));
    };
  };
