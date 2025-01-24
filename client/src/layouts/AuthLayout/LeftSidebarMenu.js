import classnames from 'classnames'
import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip
} from 'reactstrap'

import { changeLayoutMode, setActiveTab } from '../../redux/actions'

//Import Images
import avatar1 from '../../assets/images/users/avatar-1.jpg'

import { createSelector } from 'reselect'
import { setStoreChat } from '../../store/useStoreChat'
import useStoreUser, { setStoreUser } from '../../store/useStoreUser'
import { clearLS } from '../../utils/auth'
import { genAvatar } from '../../utils/utils'

function LeftSidebarMenu(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false)

  const toggle = () => setDropdownOpen(!dropdownOpen)
  const toggleMobile = () => setDropdownOpenMobile(!dropdownOpenMobile)

  const profile = useStoreUser((state) => state?.profile)

  const toggleTab = (tab) => {
    props.setActiveTab(tab)
  }

  const handleLogout = async () => {
    clearLS()
    window.Echo.disconnect()
    setStoreUser({ profile: {}, isLogged: false })
    setStoreChat({ members: [], active_user: null })
    navigate('/login')
  }

  const activeTab = props.activeTab

  return (
    <React.Fragment>
      <div className='side-menu flex-lg-column me-lg-1'>
        {/* LOGO */}
        <div className='navbar-brand-box'>
          <Link to='/' className='logo logo-dark'>
            <span className='logo-sm'>
              <img src={'/favicons/icon-32x32.png'} alt='logo' height='30' />
            </span>
          </Link>

          <Link to='/' className='logo logo-light'>
            <span className='logo-sm'>
              <img src={'/favicons/icon-32x32.png'} alt='logo' height='30' />
            </span>
          </Link>
        </div>
        {/* end navbar-brand-box  */}

        {/* Start side-menu nav */}
        <div className='flex-lg-column my-auto'>
          <Nav className='side-menu-nav nav-pills justify-content-center' role='tablist'>
            <NavItem id='profile'>
              <NavLink
                id='pills-user-tab'
                className={classnames({ active: activeTab === 'profile' }) + ' mb-2'}
                onClick={() => {
                  toggleTab('profile')
                }}
              >
                <i className='ri-user-2-line'></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target='profile' placement='top'>
              プロフィール
            </UncontrolledTooltip>
            <NavItem id='Chats'>
              <NavLink
                id='pills-chat-tab'
                className={classnames({ active: activeTab === 'chat' }) + ' mb-2'}
                onClick={() => {
                  toggleTab('chat')
                }}
              >
                <i className='ri-message-3-line'></i>
              </NavLink>
            </NavItem>
            <UncontrolledTooltip target='Chats' placement='top'>
              チャット
            </UncontrolledTooltip>
            <Dropdown
              nav
              isOpen={dropdownOpenMobile}
              toggle={toggleMobile}
              className='profile-user-dropdown d-inline-block d-lg-none dropup'
            >
              <DropdownToggle nav>
                <img src={avatar1} alt='chatting system' className='profile-user rounded-circle' />
              </DropdownToggle>
              <DropdownMenu className='dropdown-menu-end'>
                <DropdownItem
                  onClick={() => {
                    toggleTab('profile')
                  }}
                >
                  プロフィール <i className='ri-profile-line float-end text-muted'></i>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  ログアウト <i className='ri-logout-circle-r-line float-end text-muted'></i>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
        {/* end side-menu nav */}

        <div className='flex-lg-column d-none d-lg-block'>
          <Nav className='side-menu-nav justify-content-center'>
            <li className='nav-item'>
              <NavLink id='light-dark' className='mb-2' onClick={() => onChangeLayoutMode(mode)}>
                <i className='ri-sun-line theme-mode-icon'></i>
              </NavLink>
            </li>
            <Dropdown
              nav
              isOpen={dropdownOpen}
              className='nav-item btn-group dropup profile-user-dropdown'
              toggle={toggle}
            >
              <DropdownToggle className='nav-link mb-2' tag='a'>
                <div className='avatar-xs mx-auto d-block chat-user-img online'>
                  <span
                    className='avatar-title rounded-circle bg-primary-subtle text-primary'
                    style={{ fontSize: '1rem' }}
                  >
                    {profile?.op_name ? genAvatar(profile?.op_name) : genAvatar('Guest')}
                  </span>
                  <span className='user-status'></span>
                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    toggleTab('profile')
                  }}
                >
                  プロフィール <i className='ri-profile-line float-end text-muted'></i>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  ログアウト <i className='ri-logout-circle-r-line float-end text-muted'></i>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
        {/* Side menu user */}
      </div>
    </React.Fragment>
  )
}

const mapStatetoProps = (state) => {
  return {
    ...state.Layout
  }
}

export default connect(mapStatetoProps, {
  setActiveTab
})(LeftSidebarMenu)
