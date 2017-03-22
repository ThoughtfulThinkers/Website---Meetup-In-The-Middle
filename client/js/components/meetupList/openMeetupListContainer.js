import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import * as actions from '../../actions'
import MeetupList from './meetupList'

class OpenMeetupListContainer extends Component {

  componentWillMount() {
    // this.props.meetupsFetch()
    this.props.meetupsFetch(this.props.location)
  }

  fetchMeetups() {
    this.props.meetupsFetch(this.props.location);
  }

  renderVote(status, venues, location) {
    if (status === 'voting') {
      if (venues) {
        let votingArray = _.map(venues, (val, uid) => {
          return { ...val, uid }
        })
        votingArray = votingArray.sort((a, b) => b.votes - a.votes)
        return <div>Vote: { votingArray[0].name }</div>
      }
      return null
    }
    if (status === 'set') {
      return <div>{ location.name }</div>
    }
    return <div />
  }

  selectMeetup(meetup) {
    this.props.setCurrentMeetup(meetup)
    
  }

  renderMeetups() {
    const { meetups } = this.props
    if (this.props.loading) {
      return <div>Loading!!!!</div>
    } else if (meetups.length === 0) {
      return <div>There are no meetups in this state</div>
    }
    return _.map(meetups, meetup => {
      const { name, state, start, vote, uid, location, status, venues } = meetup
      return (
        <div key={uid} onClick={meetup => selectMeetup(meetup)} >
          <div className="row">
            <div className="col">{name}</div>
            <div className="col">{moment(start).format('MMM Do YYYY, h:mm a')}</div>
          </div>
          <div className="row">
            <div className="col">{this.renderVote(status, venues, location)}</div>
            <div className="col">{state}</div>
          </div>
          <hr />
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderMeetups()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  let meetups = _.map(state.meetups.cityMeetups, (val, uid) => {
    return { ...val, uid };
  });
  meetups = meetups.sort((a, b) => {
    const aDate = moment(a.start);
    const bDate = moment(b.start);
    return aDate.diff(bDate);
  });
  meetups = meetups.filter((a) => {
    return (a.status !== 'closed') && !a.privacy;
  });
  return {
    meetups,
    loading: state.meetups.cityLoading,
    location: state.filter.location,
    text: state.filter.text
  };
};

export default connect(mapStateToProps, actions)(OpenMeetupListContainer)
