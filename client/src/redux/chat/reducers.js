import {
  ACTIVE_USER,
  ADD_LOGGED_USER,
  CHAT_USER,
  CREATE_GROUP,
  FULL_USER,
} from "./constants";

const INIT_STATE = {
  active_user: 3,
  users: [
    //admin is sender and user in receiver
    {
      id: 4,
      name: "神奈川　三郎（本社）",
      profilePicture: "Null",
      status: "online",
      unRead: 0,
      isGroup: false,
      isTyping: true,
      messages: [
        {
          id: 1,
          userName: "神奈川　三郎（本社）",
          message: "Good Morning",
          time: "10:00",
          userType: "receiver",
          isImageMessage: false,
          isFileMessage: false,
        },
        { id: 33, isToday: true },
      ],
    },
    {
      id: 5,
      name: "川崎　次郎（川崎）",
      profilePicture: "Null",
      unRead: "01",
      isGroup: true,
      messages: [
        {
          id: 1,
          userName: "神奈川　三郎（本社）",
          message: "Hello send project images",
          time: "12:00",
          userType: "receiver",
          isImageMessage: false,
          isFileMessage: false,
        },
        { id: 33, isToday: true },
      ],
    },

    {
      id: 6,
      name: "横浜　一郎（台町）",
      profilePicture: "Null",
      status: "away",
      unRead: 0,
      isGroup: false,
      messages: [{ id: 33, isToday: true }],
    },

    {
      id: 14,
      name: "横浜　次郎（台町）",
      profilePicture: "Null",
      status: "away",
      unRead: 0,
      isGroup: false,
      messages: [{ id: 33, isToday: true }],
    },
  ],
};

const Chat = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHAT_USER:
      return { ...state };

    case ACTIVE_USER:
      return {
        ...state,
        active_user: action.payload,
      };

    case FULL_USER:
      return {
        ...state,
        users: action.payload,
      };

    case ADD_LOGGED_USER:
      const newUser = action.payload;
      return {
        ...state,
        users: [...state.users, newUser],
      };

    case CREATE_GROUP:
      const newGroup = action.payload;
      return {
        ...state,
        groups: [...state.groups, newGroup],
      };

    default:
      return { ...state };
  }
};

export default Chat;
