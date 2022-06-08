import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { CREATE_COMMENT } from "../graphql/gql";
import style from "./CommentInput.module.css";

export default function CommentInput({ postuuid, refetch }) {
  const [body, setBody] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT, {
    variables: {
      body,
      postuuid,
    },
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      console.log(data);
      refetch();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createComment();
  };
  return (
    <>
      <div className={style.CommentInputContainer}>
        <form className={style.CommentInputForm} onSubmit={handleSubmit}>
          <textarea
            className={style.CommentInput}
            placeholder="Add some Comment..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
          <button
            className={
              body.trim() === ""
                ? `${style.CommentInputBtn} ${style.CommentInputBtnDisabled}`
                : `${style.CommentInputBtn}`
            }
            disabled={body.trim() === ""}
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
}
