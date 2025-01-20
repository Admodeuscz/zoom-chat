import React, { useEffect } from 'react'
import Routes from './routes'

//Import Scss
import './assets/scss/themes.scss'

import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { setStoreUser } from './store/useStoreUser'

function App() {
  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutMode: layout.layoutMode
    })
  )

  const { layoutMode } = useSelector(selectLayoutProperties)

  useEffect(() => {
    layoutMode && localStorage.setItem('layoutMode', layoutMode)

    const profile = localStorage.getItem('profile')
    if (profile) {
      setStoreUser({ profile: JSON.parse(profile), isLogged: true })
    }
  }, [layoutMode])

  return <Routes />
}

export default App
