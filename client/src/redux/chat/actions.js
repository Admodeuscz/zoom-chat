import {
  ACTIVE_USER,
  ADD_LOGGED_USER,
  CHAT_USER,
  CREATE_GROUP,
  FULL_USER
} from './constants';


export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload : userId
});

export const setFullUser = (fullUser) => ({
    type: FULL_USER,
    payload : fullUser
});

export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload : userData
});

export const createGroup = (groupData) => ({
    type : CREATE_GROUP,
    payload : groupData
})
