import React, { useState } from "react";
import style from "./ChatForm.module.css";
import { FiSend } from "react-icons/fi";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../graphql/gql";
import { useGlobleContext } from "../context/context";

export default function CharForm() {
  const [message, setMessage] = useState("");
  const { selectedUser, addUserMessage } = useGlobleContext();
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: {
      input: {
        content: message,
        to: selectedUser,
      },
    },
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      // console.log(data);
      addUserMessage(data.sendMessage);
      setMessage("");
    },
  });

  const submitHandle = (e) => {
    e.preventDefault();
    sendMessage();
  };
  return (
    <>
      <div className={style.chatFormContainer}>
        <form className={style.chatForm} onSubmit={submitHandle}>
          <input
            type="text"
            className={style.chatInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className={
              message.trim() === "" || !selectedUser
                ? `${style.chatBtn} ${style.chatBtnDisabled}`
                : `${style.chatBtn}`
            }
            disabled={message.trim() === ""}
          >
            <FiSend />
          </button>
        </form>
      </div>
    </>
  );
}
