import { combineReducers } from 'redux'

import MeetupReducer from './MeetupReducer'
// import AuthReducer from './AuthReducer'
// import ChatReducer from './ChatReducer'
import FilterReducer from './FilterReducer'
// import MeetupFormReducer from './MeetupFormReducer'
// import RsvpReducer from './RsvpReducer'
// import UserReducer from './UserReducer'

const rootReducer = combineReducers({
  filter: FilterReducer,
  meetups: MeetupReducer,
})

// auth: AuthReducer,
// chat: ChatReducer,
// user: UserReducer,
// meetupForm: MeetupFormReducer,
// rsvp: RsvpReducer

export default rootReducer
