import React, { useEffect } from "react";
import style from "./ChatMessage.module.css";
import ChatForm from "./CharForm";
import { useGlobleContext } from "../context/context";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_MESSAGE } from "../graphql/gql";

export default function ChatMessage() {
  const { selectedUser, user, getUserMessage, userMessage } =
    useGlobleContext();
  // console.log(userMessage);
  const [getMessage, { loading, error, data }] = useMutation(GET_MESSAGE, {
    variables: {
      to: selectedUser,
    },
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      getUserMessage(data.getMessage);
    },
  });

  useEffect(() => {
    if (selectedUser === "") return;
    getMessage();
    // if (!error && !loading && data) {
    //   getUserMessage(data.getMessage);
    // }
  }, [selectedUser]);

  let messageList;
  if (loading) {
    messageList = <div className="loading"></div>;
  } else if (error) {
    messageList = <p className="errorMessage">Something went wrong...</p>;
  } else if (!loading && !error && data && userMessage.length === 0) {
    messageList = <p className="errorMessage">No messsage...</p>;
  } else if (!loading && !error && userMessage.length > 0) {
    messageList = (
      <div className={style.messageListContainer}>
        {userMessage.map((msg) => {
          const { uuid, to, from, content } = msg;

          return (
            <p
              key={uuid}
              className={
                user.name === from
                  ? `${style.singleMessageContainer} ${style.from}`
                  : `${style.singleMessageContainer} ${style.to}`
              }
            >
              <span
                className={
                  user.name === to
                    ? `${style.singleMessage} ${style.toColor}`
                    : `${style.singleMessage} ${style.fromColor}`
                }
              >
                {content}
              </span>
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className={style.chatMessageContainer}>
        <div className={style.chatMessage}>
          {selectedUser ? (
            messageList
          ) : (
            <p className="errorMessage">Choose user to Chat</p>
          )}
        </div>
        <ChatForm />
      </div>
    </>
  );
}
