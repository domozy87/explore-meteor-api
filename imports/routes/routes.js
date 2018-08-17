import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'

import Signup from '../ui/Signup'
import Link from '../ui/Link/Link'
import Site from '../ui/Site/Site'
import Order from '../ui/Order/Order'
import Tour from '../ui/Tour/Tour'
import Comment from '../ui/Comment/Comment'
import NotFound from '../ui/NotFound'
import Login from '../ui/Login/Login'

const unauthenticatedPages = ['/', '/signup']
const authenticatedPages = ['/tours']
const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/tours')
  }
}
const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/')
  }
}

// Figure out whether or not user is logged in and direct them to the correct page.
export const onAuthChange = (isAuthenticated) => {
  const pathName = browserHistory.getCurrentLocation().pathname
  // true / false values
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathName)
  const isAuthenticatedPage = authenticatedPages.includes(pathName)

  if (isUnauthenticatedPage && isAuthenticated) {
    browserHistory.replace('/tours')
  } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/')
  }
}

export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Login} onEnter={onEnterPublicPage} />
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage} />
    <Route path="/links" component={Link} onEnter={onEnterPrivatePage} />
    <Route path="/sites" component={Site} onEnter={onEnterPrivatePage} />
    <Route path="/orders" component={Order} onEnter={onEnterPrivatePage} />
    <Route path="/tours" component={Tour} onEnter={onEnterPrivatePage} />
    <Route path="/comments" component={Comment} onEnter={onEnterPrivatePage} />
    <Route path="*" component={NotFound} />
  </Router>
)
