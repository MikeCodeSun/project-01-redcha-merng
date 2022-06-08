const reducer = (state, action) => {
  if (action.type === "CHANGE_THEME") {
    if (state.theme) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
    }
    return { ...state, theme: !state.theme };
  }
  if (action.type === "LOGIN") {
    localStorage.setItem("token", action.payload.token);
    return { ...state, user: action.payload };
  }
  if (action.type === "LOGOUT") {
    localStorage.removeItem("token");
    return { ...state, user: null };
  }
  if (action.type === "SELECT_USER") {
    return { ...state, selectedUser: action.payload };
  }
  if (action.type === "GET_USER_MESSAGE") {
    return { ...state, userMessage: action.payload };
  }
  if (action.type === "ADD_USER_MESSAGE") {
    return { ...state, userMessage: [action.payload, ...state.userMessage] };
  }
  if (action.type === "GET_ALL_POSTS") {
    return { ...state, allPosts: action.payload };
  }
  if (action.type === "CHANGE_VOTE") {
    const newPosts = state.allPosts.map((post) => {
      if (post.uuid === action.payload.postuuid) {
        console.log("post");
        if (action.payload.value === post.voteUser) {
          console.log("same");
          return {
            ...post,
            voteUser: null,
            voteValue: post.voteValue - post.voteUser,
          };
        } else {
          console.log("dif");
          return {
            ...post,
            voteUser: action.payload.value,
            voteValue: post.voteValue + action.payload.value,
          };
        }
      }
      return post;
    });
    return { ...state, allPosts: newPosts };
  }
  return state;
};

export default reducer;
