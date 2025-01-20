import Echo from 'laravel-echo'

import Pusher from 'pusher-js'

window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.REACT_APP_PUSHER_APP_KEY,
  wsHost: process.env.REACT_APP_PUSHER_APP_HOST,
  wsPort: process.env.REACT_APP_PUSHER_APP_PORT,
  forceTLS: (process.env.REACT_APP_PUSHER_APP_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss']
})
