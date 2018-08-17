import React from 'react'
import PrivateHeader from '../PrivateHeader'
import SearchSite from './SearchTour'

export default () => (
  <div>
    <PrivateHeader title="Tour" />
    <div className="page-content">
      <SearchSite />
    </div>
  </div>
)
