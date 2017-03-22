import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import * as actions from '../../actions'

/************************************************************
  find lat/log that is average distance from all attendees
************************************************************/
const getAve = array => {
  const sum = array.reduce((a, b) => a + b)
  return sum / array.length
}

const getLatLon = users => {
  const usersArray = _.map(users, (val, uid) => {
    return { ...val, uid }
  })

  const latArray = usersArray.map(user => user.lat)
  const lonArray = usersArray.map(user => user.lon)
  const lat = getAve(latArray)
  const lon = getAve(lonArray)
  return { lat, lon }
}

/****************************************************
  Meetup
****************************************************/
class Meetup extends Component {
  render() {
    return (
      <div>Meetup Component</div>
    )
  }
}

const mapStateToProps = state => {
  const { meetupForm, auth, user } = state;
  const { status, attendingNames } = meetupForm;
  const names = Object.keys(attendingNames).map(key => attendingNames[key]);
  return { meetup: meetupForm, auth, user, status, names };
}


export default connect(null, actions)(Meetup)
