import { useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatUser from "../components/ChatUser";
import { useGlobleContext } from "../context/context";
import { NEW_MESSAGE } from "../graphql/gql";
import style from "./Chat.module.css";

export default function Chat() {
  const { addUserMessage, user } = useGlobleContext();
  const { data, error, loading } = useSubscription(NEW_MESSAGE, {
    onSubscriptionData(data) {
      // console.log(data);
      // console.log(data.subscriptionData.data.newMessage);
      // console.log("sub");
      if (data.subscriptionData.data.newMessage.from !== user.name) {
        addUserMessage(data.subscriptionData.data.newMessage);
      }
    },
  });

  return (
    <>
      <section className={style.chatContainer}>
        <ChatUser />
        <ChatMessage />
      </section>
    </>
  );
}
