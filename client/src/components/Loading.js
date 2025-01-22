const Loading = () => (
  <div className='text-center my-3'>
    <div className='chat-loader d-inline-flex align-items-center px-4 py-2 rounded-3'>
      <div className='spinner-grow text-primary' role='status' style={{ width: '0.75rem', height: '0.75rem' }}>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='spinner-grow text-primary mx-2' role='status' style={{ width: '0.75rem', height: '0.75rem' }}>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='spinner-grow text-primary' role='status' style={{ width: '0.75rem', height: '0.75rem' }}>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  </div>
)

export default Loading
