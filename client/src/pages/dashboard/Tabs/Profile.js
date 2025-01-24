import React, { useState } from 'react'
import { Card } from 'reactstrap'

//Import components
import CustomCollapse from '../../../components/CustomCollapse'

//i18n
import { useTranslation } from 'react-i18next'
import useStoreUser from '../../../store/useStoreUser'
import { genAvatar, getOperatorColor } from '../../../utils/utils'

function Profile(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isOpen1, setIsOpen1] = useState(true)
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation()
  const profile = useStoreUser((state) => state?.profile)

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1)
  }

  const toggle = () => setDropdownOpen(!dropdownOpen)

  return (
    <React.Fragment>
      <div>
        <div className='px-4 pt-4'>
          {/* <div className='user-chat-nav float-end'>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle tag='a' className='font-size-18 text-muted dropdown-toggle'>
                <i className='ri-more-2-fill'></i>
              </DropdownToggle>
              <DropdownMenu className='dropdown-menu-end'>
                <DropdownItem>{t('Edit')}</DropdownItem>
                <DropdownItem>{t('Action')}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>{t('Another action')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div> */}
          <h4 className='mb-0'>私のプロフィール</h4>
        </div>

        <div className='text-center p-4 border-bottom'>
          <div className='mb-4'>
            <div className='avatar-lg mx-auto'>
              <span className='avatar-title rounded-circle' style={{ backgroundColor: getOperatorColor(profile) }}>
                {genAvatar(profile?.op_name)}
              </span>
            </div>
          </div>

          <h5 className='font-size-16 mb-1 text-truncate'>神奈川　太郎</h5>
          <p className='text-muted text-truncate mb-1'>
            <i className='ri-record-circle-fill font-size-10 text-success me-1 d-inline-block'></i> アクティブ
          </p>
        </div>
        {/* End profile user  */}

        {/* Start user-profile-desc */}
        <div className='p-4 user-profile-desc'>
          <div className='text-muted'>
            <p className='mb-4'>ご自身のプロフィールをご確認ください。</p>
          </div>

          <div id='profile-user-accordion-1' className='custom-accordion'>
            <Card className='shadow-none border mb-2'>
              {/* import collaps */}
              <CustomCollapse
                title='インフォメーション'
                iconClass='ri-user-2-line'
                isOpen={isOpen1}
                toggleCollapse={toggleCollapse1}
              >
                <div>
                  <p className='text-muted mb-1'>名前</p>
                  <h5 className='font-size-14'>{profile?.op_name}</h5>
                </div>

                <div className='mt-4'>
                  <p className='text-muted mb-1'>メール</p>
                  <h5 className='font-size-14'>{profile?.email}</h5>
                </div>
              </CustomCollapse>
            </Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Profile
