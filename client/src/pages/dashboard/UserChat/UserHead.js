import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink } from 'reactstrap'
import { createSelector } from 'reselect'
import { changeLayoutMode } from '../../../redux/actions'

import { useMutation } from '@tanstack/react-query'
import authApi from '../../../apis/auth.api'
import { openUserSidebar, setFullUser } from '../../../redux/actions'
import { setStoreUser } from '../../../store/useStoreUser'
import { clearLS } from '../../../utils/auth'

const UserHead = ({ user }) => {
  const dispatch = useDispatch()

  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutMode: layout.layoutMode
    })
  )

  const { layoutMode } = useSelector(selectLayoutProperties)

  const mode = layoutMode === 'dark' ? 'light' : 'dark'

  const onChangeLayoutMode = (value) => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value))
    }
  }

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const toggleProfile = () => setProfileDropdownOpen(!profileDropdownOpen)

  const toggleTab = (tab) => {
    // props.setActiveTab(tab)
  }

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setStoreUser({ profile: null, isLogged: false })
      clearLS()
      window.location.reload()
    }
  })

  return (
    <React.Fragment>
      <div className='p-3 p-lg-4 border-bottom user-chat-topbar'>
        <ul className='list-inline user-chat-nav text-end mb-0'>
          <div className='list-inline-item'>
            <NavLink id='light-dark' onClick={() => onChangeLayoutMode(mode)}>
              <i className='ri-sun-line theme-mode-icon font-size-20 align-middle'></i>
            </NavLink>
          </div>
          <li className='list-inline-item head-profile-avatar'>
            <Dropdown
              isOpen={profileDropdownOpen}
              toggle={toggleProfile}
              className='btn-group dropup profile-user-dropdown'
            >
              <DropdownToggle className='nav-link' tag='a'>
                <div className='avatar-xs'>
                  <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>
                    {user.op_name.charAt(0)}
                  </span>
                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    toggleTab('profile')
                  }}
                >
                  Profile <i className='ri-profile-line float-end text-muted'></i>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => logoutMutation.mutate()}>
                  Log out <i className='ri-logout-circle-r-line float-end text-muted'></i>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  const { users, active_user } = state.Chat
  return { ...state.Layout, users, active_user }
}

export default connect(mapStateToProps, { openUserSidebar, setFullUser })(UserHead)
