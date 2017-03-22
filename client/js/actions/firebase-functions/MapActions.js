import firebase from 'firebase';

//createVoting functions:
export const setMeetup = (meetup) => {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/meetups/${meetup.uid}`)
  .set(meetup);
};

//setVote functions:
export const firebaseUserVote = (meetupId, venueId) => {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/users/${currentUser.uid}/meetups/${meetupId}/vote`)
  .set(venueId);
};

export const firebaseVenueVote = (meetupId, venueId, venueVote) => {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/meetups/${meetupId}/venues/${venueId}/votes`)
  .set(venueVote);
};

//voteChange functions:
//TODO: pull out firebase calls

//changeLocation functions:
export const setLocation = (meetupId, location) => {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/meetups/${meetupId}/location`)
  .set(location);
};
