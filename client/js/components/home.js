import React, { Component } from 'react'

import Header from './head/header'
// import UserMeetupListContainer from './meetup/userMeetupListContainer'
import OpenMeetupListContainer from './meetupList/openMeetupListContainer'
import MeetupList from './meetupList/meetupList'

class Home extends Component {

  render() {
    // <MeetupList />
    // <UserMeetupListContainer />
    return (
      <div>
        <Header />
        <OpenMeetupListContainer />
      </div>
    )
  }
}

export default Home
