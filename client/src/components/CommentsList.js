import React from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import style from "./Posts.module.css";

import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import { CREATE_VOTE } from "../graphql/gql";

dayjs.extend(relativeTime);

export default function CommentsList({ comments, subname, refetch }) {
  const [createVote] = useMutation(CREATE_VOTE, {
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      console.log(data);
      refetch();
    },
  });
  const voteHandle = (value, commentuuid) => {
    createVote({
      variables: {
        input: {
          value,
          commentuuid,
          postuuid: null,
        },
      },
    });
  };
  const navigate = useNavigate();
  return (
    <>
      {comments.map((comment) => {
        const {
          body,
          createdAt,
          uuid,

          voteUser,
          voteValue,
          username,
          userImg,
        } = comment;
        return (
          <article key={uuid} className={style.singleContainer}>
            <section className={style.voteContainer}>
              <div
                className={
                  voteUser === 1
                    ? `${style.voteUp} ${style.voteUpUser}`
                    : `${style.voteUp}`
                }
                onClick={() => voteHandle(1, uuid)}
              >
                <ImArrowUp />
              </div>
              <div className={style.voteValue}>{voteValue}</div>
              <div
                className={
                  voteUser === -1
                    ? `${style.voteDown} ${style.voteDownUser}`
                    : `${style.voteDown}`
                }
                onClick={() => voteHandle(-1, uuid)}
              >
                <ImArrowDown />
              </div>
            </section>
            <section className={style.postInfoContainer}>
              <div className={style.postHeader}>
                <div className={style.postUserImgCon}>
                  <img
                    src={userImg}
                    className={style.postUserImg}
                    alt={username}
                  />
                </div>
                <div
                  className={style.postSub}
                  onClick={() => navigate(`/${subname}`)}
                >
                  /{subname}
                </div>
                <div className={style.postUser}>Posted by {username}</div>
                <div className={style.postDate}>
                  from {dayjs(createdAt).fromNow()}
                </div>
              </div>
              <div className={style.postContent}>
                {/* <h5>{title}</h5> */}
                <p>{body}</p>
              </div>
              {/* <div className={style.postFooter}>
                <div
                  className={`${style.commentIcon} ${singlePostStyle.singleComment}`}
                >
                  <FaRegCommentAlt /> {commentsCount} Comments
                </div>
              </div> */}
            </section>
          </article>
        );
      })}
    </>
  );
}
