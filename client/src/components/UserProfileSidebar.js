import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Badge, Button, Card } from 'reactstrap'

//Simple bar
import SimpleBar from 'simplebar-react'

import CustomCollapse from './CustomCollapse'

import { closeUserSidebar } from '../redux/actions'

//i18n
import { useTranslation } from 'react-i18next'

//image
import avatar7 from '../assets/images/users/avatar-7.jpg'

function UserProfileSidebar({ user, userSidebar, closeUserSidebar }) {
  const [isOpen1, setIsOpen1] = useState(true)
  const [isOpen3, setIsOpen3] = useState(false)
  const { t } = useTranslation()

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1)
    setIsOpen3(false)
  }

  const toggleCollapse3 = () => {
    setIsOpen3(!isOpen3)
    setIsOpen1(false)
  }

  // Nếu không có user thì return null
  if (!user) return null

  return (
    <React.Fragment>
      <div style={{ display: userSidebar ? 'block' : 'none' }} className='user-profile-sidebar'>
        <div className='px-3 px-lg-4 pt-3 pt-lg-4'>
          <div className='user-chat-nav text-end'>
            <Button color='none' type='button' onClick={closeUserSidebar} className='nav-btn' id='user-profile-hide'>
              <i className='ri-close-line'></i>
            </Button>
          </div>
        </div>

        <div className='text-center p-4 border-bottom'>
          <div className='mb-4 d-flex justify-content-center'>
            {user.profilePicture === 'Null' ? (
              <div className='avatar-lg'>
                <span className='avatar-title rounded-circle bg-primary-subtle text-primary font-size-24'>
                  {user.name.charAt(0)}
                </span>
              </div>
            ) : (
              <img src={user.profilePicture} className='rounded-circle avatar-lg img-thumbnail' alt='chatting system' />
            )}
          </div>

          <h5 className='font-size-16 mb-1 text-truncate'>{user.name}</h5>
          <p className='text-muted text-truncate mb-1'>
            <i className='ri-record-circle-fill font-size-10 text-success me-1'></i>
            Active
          </p>
        </div>
        {/* End profile user */}

        {/* Start user-profile-desc */}
        <SimpleBar style={{ maxHeight: '100%' }} className='p-4 user-profile-desc'>
          <div id='profile-user-accordion' className='custom-accordion'>
            <Card className='shadow-none border mb-2'>
              {/* import collaps */}
              <CustomCollapse
                title='インフォメーション'
                iconClass='ri-user-2-line'
                isOpen={isOpen1}
                toggleCollapse={toggleCollapse1}
              >
                <div>
                  <p className='text-muted mb-1'>{t('Name')}</p>
                  <h5 className='font-size-14'>{user.name}</h5>
                </div>

                <div className='mt-4'>
                  <p className='text-muted mb-1'>{t('Email')}</p>
                  <h5 className='font-size-14'>{user.email}</h5>
                </div>

                <div className='mt-4'>
                  <p className='text-muted mb-1'>{t('Time')}</p>
                  <h5 className='font-size-14'>11:40 AM</h5>
                </div>

                <div className='mt-4'>
                  <p className='text-muted mb-1'>{t('Location')}</p>
                  <h5 className='font-size-14 mb-0'>California, USA</h5>
                </div>
              </CustomCollapse>
            </Card>
            {/* End About card */}

            {user.isGroup === true && (
              <Card className='mb-1 shadow-none border'>
                {/* import collaps */}
                <CustomCollapse
                  title='Members'
                  iconClass='ri-group-line'
                  isOpen={isOpen3}
                  toggleCollapse={toggleCollapse3}
                >
                  <Card className='p-2 mb-2'>
                    <div className='d-flex align-items-center'>
                      <div className=' align-self-center me-3'>
                        <div className='avatar-xs'>
                          <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>S</span>
                        </div>
                      </div>
                      <div>
                        <div className='text-left'>
                          <h5 className='font-size-14 mb-1'>
                            {t('Sera Mullar')}
                            <Badge color='danger' className='badge-soft-danger float-end'>
                              {t('Admin')}
                            </Badge>
                          </h5>
                          {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className='p-2 mb-2'>
                    <div className='d-flex align-items-center'>
                      <div className='chat-user-img align-self-center me-2'>
                        <div className='avatar-xs'>
                          <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>O</span>
                        </div>
                      </div>
                      <div>
                        <div className='text-left'>
                          <h5 className='font-size-14 mb-1'>{t('Ossie Wilson')}</h5>
                          {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className='p-2 mb-2'>
                    <div className='d-flex align-items-center'>
                      <div className='chat-avatar'>
                        <img
                          src={avatar7}
                          className='rounded-circle chat-user-img avatar-xs me-3'
                          alt='Chatting system'
                        />
                      </div>
                      <div>
                        <div className='text-left'>
                          <h5 className='font-size-14 mb-1'>{t('Paul Haynes')}</h5>
                          {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                        </div>
                      </div>
                    </div>
                  </Card>
                </CustomCollapse>
              </Card>
            )}
          </div>
        </SimpleBar>
        {/* end user-profile-desc */}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  userSidebar: state.Layout.userSidebar
})

export default connect(mapStateToProps, { closeUserSidebar })(UserProfileSidebar)
