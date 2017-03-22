import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import * as actions from '../../actions'

class MeetupList extends Component {

  componentWillMount() {
    this.props.meetupsFetch('New York')
  }

  renderMeetups() {
    const { cityMeetups } = this.props
    return _.map(cityMeetups, (meetup, key) => {
      return (
        <div key={key} onClick={() => console.log('clicked')} >
          <hr />
          <div className="row">
            <div className="col">{meetup.name}</div>
            <div className="col">{moment(meetup.start).format('MMM Do YYYY, h:mm a')}</div>
          </div>
          <div className="row">
            <div className="col-12">{meetup.description}</div>
          </div>
        </div>
      )
    })
  }

  render() {
    // console.log(this.props.cityMeetups)
    return (
      <div className="container">
        <div className="container-fluid">
          Local Meetups
        </div>
        {this.renderMeetups()}
      </div>
    )
  }
}

const mapStateToProps = ({ meetups }) => {
  const { cityMeetups } = meetups
  return { cityMeetups }
}

export default connect(mapStateToProps, actions)(MeetupList)
