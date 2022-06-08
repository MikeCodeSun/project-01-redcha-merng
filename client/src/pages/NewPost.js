import React, { useState } from "react";
import style from "./NewPost.module.css";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../graphql/gql";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const { subname } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const [createPost] = useMutation(CREATE_POST, {
    variables: {
      input: {
        title,
        body,
        subname,
      },
    },
    onError(err) {
      console.log("er");
      console.log(err);
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      console.log("com");
      console.log(data);
      navigate(`/${subname}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  return (
    <>
      <div className={style.newPostContainer}>
        <form className={style.newPostForm} onSubmit={handleSubmit}>
          <div className="title">
            <h4>
              New Post <small>on</small> /{subname}
            </h4>
            <div className="title-underline"></div>
          </div>
          <div className={style.newPostControl}>
            <label
              htmlFor="title"
              className={
                errors?.title
                  ? `${style.newPostLabel} ${style.newPostAlert}`
                  : `${style.newPostLabel}`
              }
            >
              {errors?.title ? errors.title : "Title:"}
            </label>
            <input
              id="title"
              type="text"
              className={
                errors?.title
                  ? `${style.newPostInput} ${style.newPostAlertBorder}`
                  : `${style.newPostInput}`
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={style.newPostControl}>
            <label htmlFor="body" className={style.newPostLabel}>
              Content:
            </label>
            <textarea
              id="body"
              type="text"
              className={style.newPostInput}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className={style.newPostControl}>
            <button className={style.newPostBtn} type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
