import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import queryClient from './config/queryClient'
import AuthProvider from './providers/AuthProvider'
import { configureStore } from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={configureStore()}>
      <React.Fragment>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  </QueryClientProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
