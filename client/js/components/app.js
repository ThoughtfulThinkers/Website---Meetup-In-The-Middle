import React, { Component } from 'react'
import firebase from 'firebase'
import { fbConfig } from '../../../envConfig'

export default class App extends Component {
  componentWillMount() {
    firebase.initializeApp(fbConfig)
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
