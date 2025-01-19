import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Row, Col, DropdownItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect';
import { changeLayoutMode } from "../../../redux/actions";

import { openUserSidebar, setFullUser } from "../../../redux/actions";

function UserHead(props) {
    const dispatch = useDispatch();

    const selectLayoutProperties = createSelector(
        (state) => state.Layout,
        (layout) => ({
            layoutMode: layout.layoutMode,
        })
    );
    
    const { layoutMode } = useSelector(selectLayoutProperties);

    const mode = layoutMode === "dark" ? "light" : "dark";

    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    }

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    
    const toggleProfile = () => setProfileDropdownOpen(!profileDropdownOpen);

    function closeUserChat(e) {
        e.preventDefault();
        var userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.remove("user-chat-show");
        }
    }

    const toggleTab = tab => {
        props.setActiveTab(tab)
    }

    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
                <Row className="align-items-center">
                    <Col sm={4} xs={8}>
                        <div className="d-flex align-items-center">
                            <div className="d-block d-lg-none me-2 ms-0">
                                <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                                    <i className="ri-arrow-left-s-line"></i></Link>
                            </div>
                            {
                                props.users[props.active_user].profilePicture !== "Null" ?
                                    <div className="me-3 ms-0">
                                        <img src={props.users[props.active_user].profilePicture} className="rounded-circle avatar-xs" alt="chatting system" />
                                    </div>
                                    : <div className="chat-user-img align-self-center me-3">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                {props.users[props.active_user].name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                            }

                            <div className="flex-grow-1 overflow-hidden">
                               asd
                            </div>
                        </div>
                    </Col>
                    <Col sm={8} xs={4} >
                        <ul className="list-inline user-chat-nav text-end mb-0">
                            <div className="list-inline-item">
                                <NavLink id="light-dark" onClick={() => onChangeLayoutMode(mode)}>
                                    <i className="ri-sun-line theme-mode-icon font-size-20 align-middle"></i>
                                </NavLink>
                            </div>
                            <li className="list-inline-item head-profile-avatar">
                                <Dropdown isOpen={profileDropdownOpen} toggle={toggleProfile} className="btn-group dropup profile-user-dropdown">
                                    <DropdownToggle className="nav-link" tag="a">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                              sdf
                                            </span>
                                        </div>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => { toggleTab('profile'); }}>Profile <i className="ri-profile-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="/logout">Log out <i className="ri-logout-circle-r-line float-end text-muted"></i></DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const { users, active_user } = state.Chat;
    return { ...state.Layout, users, active_user };
};

export default connect(mapStateToProps, { openUserSidebar, setFullUser })(UserHead);