import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { fbConfig } from '../envConfig';

import {
  FETCH_MESSAGES_BY_MEETUP_SUCCESS
} from './types';


export const sendMessageByMeetup = (id, message) => {
  // TODO: Check currentUser status
  const { currentUser } = firebase.auth();
  // console.log('sendMessageByMeetup', message);
  const { text, user } = message[0];
  const createdAt = firebase.database.ServerValue.TIMESTAMP;
  return dispatch => {
    firebase.database().ref(`/chatrooms/${id}`)
      .push({
        createdAt,
        text,
        user,
      })
      // .then(() => console.log('Chat Action sendMessageByMeetup: message added'))
      .catch(error => console.log(error));
  };
};

export const fetchMessagesByMeetup = id => {
  // TODO: if not current user, send to login page
  const { currentUser } = firebase.auth();
  return dispatch => {
    // console.log('room id ', id);
    const messages = firebase.database().ref(`/chatrooms/${id}`).orderByKey();
    messages.on('child_added', snapshot => {
      // console.log('snap.val ', snapshot.val());
      // console.log('snap._id', snapshot.key);
      const message = snapshot.val();
      const data = {
        roomId: id,
        _id: snapshot.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name
        }
      };
      // console.log('data ', data);
      dispatch({ type: FETCH_MESSAGES_BY_MEETUP_SUCCESS, payload: data });
    });
    // messages.off();
  };
};

export const closeMeetUpChat = id => {
  firebase.database().ref(`/chatrooms/${id}`);
};

export const loadMessages = (id, callback) => {
  this.messagesRef = firebase.database().ref('/messages/${id}');
  this.messagesRef.off();
  const onReceive = (data) => {
    const message = data.val();
    callback({
      _id: data.key,
      text: message.text,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.user._id,
        name: message.user.name,
      },
    });
  };
  this.messagesRef.limitToLast(20).on('child_added', onReceive);
};
