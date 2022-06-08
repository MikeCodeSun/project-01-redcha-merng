import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { CREATE_VOTE, GET_POST } from "../graphql/gql";
import style from "../components/Posts.module.css";
import singlePostStyle from "./SinglePost.module.css";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import CommentInput from "../components/CommentInput";
import { useGlobleContext } from "../context/context";
import CommentsList from "../components/CommentsList";
dayjs.extend(relativeTime);

export default function SinglePost() {
  const { subname, postuuid } = useParams();
  const context = useGlobleContext();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_POST, {
    variables: {
      uuid: postuuid,
    },
  });
  const [createVote] = useMutation(CREATE_VOTE, {
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      context.changeVote(data.createVote);
      refetch();
    },
  });
  const voteHandle = (value, postuuid) => {
    createVote({
      variables: {
        input: {
          value,
          postuuid,
          commentuuid: null,
        },
      },
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  if (error) {
    return <h5 className="errorMessage">Something went wrong...</h5>;
  }
  if (loading) {
    return <div className="loading"></div>;
  }
  if (data && data.getPost.length === 0) {
    return <h5 className="errorMessage">No Posts...</h5>;
  }
  // console.log(data);
  const {
    uuid,
    title,
    body,
    username,
    subname: sbn,
    createdAt,
    commentsCount,
    voteValue,
    voteUser,
    user,
    comments,
  } = data.getPost;
  // console.log(sbn);
  console.log(comments);
  return (
    <>
      <div className={style.container}>
        {/* post */}
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
                  src={user.image}
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
              <h5>{title}</h5>
              <p>{body}</p>
            </div>
            <div className={style.postFooter}>
              <div
                className={`${style.commentIcon} ${singlePostStyle.singleComment}`}
              >
                <FaRegCommentAlt /> {commentsCount} Comments
              </div>
            </div>
          </section>
        </article>
        {/* input comment */}
        {context.user && <CommentInput postuuid={postuuid} refetch={refetch} />}
        <CommentsList comments={comments} subname={sbn} refetch={refetch} />
      </div>
    </>
  );
}
