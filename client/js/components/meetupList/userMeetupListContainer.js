import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import * as actions from '../../actions'
import MeetupList from './meetupList'

class UserMeetupListContainer extends Component {
  componentDidMount() {
    this.props.userMeetupsFetch();
  }

  fetchMeetups() {
    this.props.userMeetupsFetch();
  }

  render() {
    let textContent;
    if (this.props.loading) {
      textContent = <div>Loading!!!</div>;
    } else if (this.props.meetups.length === 0) {
      textContent = (
        <div>
          <div>You have no meetups scheduled. </div>
          <button className="btn btn-default btn-lg" onPress={this.fetchMeetups.bind(this)}>
            fetch
          </button>
        </div>);
    } else {
      textContent = (
        <div>
            <div>Your Meetups</div>
            <div onPress={this.fetchMeetups.bind(this)}>Your Meetups</div>
        </div>);
    }
    return (
      <div className="container">
        <div>
          User Meetups Go Here
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  let meetups = _.map(state.meetups.userMeetups, (val, uid) => {
    return { ...val, uid };
  });
  meetups = meetups.sort((a, b) => {
    const aDate = moment(a.start);
    const bDate = moment(b.start);
    return aDate.diff(bDate);
  });
  const removeDate = moment().subtract(1, 'months');
  meetups = meetups.filter((a) => {
    return moment(a.end).isAfter(removeDate);
  });
  return { meetups, loading: state.meetups.userLoading };
}

export default connect(mapStateToProps, actions)(UserMeetupListContainer)
