import firebase from 'firebase';

export const getUser = () => {
  const { currentUser } = firebase.auth();
  return currentUser;
};

export const pushMeetup = (meetup) => {
  return firebase.database().ref('/meetups')
    .push(meetup);
};

export const updateMeetup = (meetupId, updates) => {
  return firebase.database().ref(`/meetups/${meetupId}`)
    .update(updates);
};

export const setStatus = (meetupId, status) => {
  return firebase.database().ref(`/meetups/${meetupId}/status`)
    .set(status);
};

export const removeGuest = (meetupId, userId) => {
  return firebase.database().ref(`/users/${userId}/meetups/${meetupId}`)
    .remove();
};

export const removeMeetup = (meetupId) => {
  return firebase.database().ref(`/meetups/${meetupId}`).remove();
};
