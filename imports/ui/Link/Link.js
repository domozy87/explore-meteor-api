import React from 'react'
import LinksList from './LinksList'
import PrivateHeader from '../PrivateHeader'
import AddLink from './AddLink'
import LinksListFilters from './LinksListFilters'

export default () => (
  <div>
    <PrivateHeader title="Driver-App Link" />
    <div className="page-content">
      <LinksListFilters />
      <AddLink />
      <LinksList />
    </div>
  </div>
)
