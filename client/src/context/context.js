import { createContext, useContext, useReducer } from "react";
import reducer from "./reducer";
import jwtDecode from "jwt-decode";

const AppContext = createContext(null);

const initialState = {
  user: null,
  theme: true,
  selectedUser: "",
  userMessage: [],
  allPosts: [],
};
// check theme
if (localStorage.getItem("theme")) {
  initialState.theme = false;
}
// check user
if (localStorage.getItem("token")) {
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  if (decode.exp * 1000 > Date.now()) {
    initialState.user = decode;
  } else {
    localStorage.removeItem("token");
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeTheme = () => {
    dispatch({ type: "CHANGE_THEME" });
  };

  const login = (userData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const chooseUser = (selectUser) => {
    dispatch({ type: "SELECT_USER", payload: selectUser });
  };

  const getUserMessage = (messageData) => {
    dispatch({ type: "GET_USER_MESSAGE", payload: messageData });
  };

  const addUserMessage = (singleMessageData) => {
    dispatch({ type: "ADD_USER_MESSAGE", payload: singleMessageData });
  };

  const getAllPosts = (postsData) => {
    dispatch({ type: "GET_ALL_POSTS", payload: postsData });
  };
  const changeVote = (voteData) => {
    dispatch({ type: "CHANGE_VOTE", payload: voteData });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        changeTheme,
        login,
        logout,
        chooseUser,
        getUserMessage,
        addUserMessage,
        getAllPosts,
        changeVote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobleContext = () => useContext(AppContext);
