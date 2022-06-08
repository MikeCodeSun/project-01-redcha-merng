import React from "react";
import style from "./ChatUser.module.css";
import { GET_USERS } from "../graphql/gql";
import { useQuery } from "@apollo/client";
import { useGlobleContext } from "../context/context";

export default function ChatUser() {
  const { selectedUser, chooseUser } = useGlobleContext();

  const {
    data: userData,
    loading: userLoaidng,
    error: userError,
  } = useQuery(GET_USERS, {
    onError(err) {
      console.log(err.message);
    },
    onCompleted(data) {
      // console.log(data);
    },
  });
  // user render div
  let chatUserDiv;
  if (userLoaidng) {
    chatUserDiv = <div className="loading"></div>;
  } else if (userError) {
    chatUserDiv = <p className="errorMessage">Something went wrong...</p>;
  } else if (
    !userLoaidng &&
    !userError &&
    userData &&
    userData.getUsers.length === 0
  ) {
    chatUserDiv = <p className="errorMessage">No users...</p>;
  } else if (
    !userLoaidng &&
    !userError &&
    userData &&
    userData.getUsers.length > 0
  ) {
    chatUserDiv = userData.getUsers.map((user) => {
      const { uuid, name, image } = user;
      const activedUser = selectedUser === name;
      return (
        <article
          key={uuid}
          className={
            activedUser
              ? `${style.chatSingleUser} ${style.actived}`
              : `${style.chatSingleUser}`
          }
          onClick={() => chooseUser(name)}
        >
          <div className={style.chatSingleUserImgContainer}>
            <img
              src={image}
              alt="userimage"
              className={style.chatSingleUserImg}
            />
          </div>
          <div className={style.chatSingleUserInfo}>
            <p>{name}</p>
          </div>
        </article>
      );
    });
  }
  return (
    <>
      <div className={style.chatUser}>{chatUserDiv}</div>
    </>
  );
}
