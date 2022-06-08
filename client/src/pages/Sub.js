import React, { useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_VOTE,
  GET_POSTS_SUB,
  GET_SUB,
  UPLOAD_IMG,
} from "../graphql/gql";
import style from "../components/Posts.module.css";
import subStyle from "./Sub.module.css";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { FaRegCommentAlt, FaRegEdit } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGlobleContext } from "../context/context";

dayjs.extend(relativeTime);

export default function Sub() {
  const { subname } = useParams();
  const navigate = useNavigate();
  const context = useGlobleContext();

  // console.log(context.user.name);
  const { data, error, loading, refetch } = useQuery(GET_POSTS_SUB, {
    variables: {
      subname,
    },
  });
  //
  const {
    data: subData,
    error: subError,
    loading: subLoading,
    refetch: subRefetch,
  } = useQuery(GET_SUB, {
    variables: {
      subname,
    },
  });
  //
  const [upload] = useMutation(UPLOAD_IMG, {
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      console.log(data);
      console.log("sub img");
      subRefetch();
      // refetch();
    },
  });
  //
  const [createVote] = useMutation(CREATE_VOTE, {
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      // console.log(data.createVote);
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

  // open upload input
  const uploadInputRef = useRef(null);
  const opneUpload = () => {
    if (subData && subData.getSubPosts.username !== context.user?.name) return;
    uploadInputRef.current.click();
  };
  const uploadImg = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    // console.log(validity);
    // console.log(file);
    if (validity.valid) {
      upload({
        variables: {
          input: {
            subname,
            file,
          },
        },
      });
    }
  };
  // header
  let header = (
    <div className={subStyle.subHeader}>
      <div className={subStyle.subHeaderTop}></div>
      <div className={subStyle.subHeaderBottom}>
        <div
          className={
            subData &&
            context.user &&
            subData.getSubPosts.username === context.user.name
              ? `${subStyle.subImg} ${subStyle.uploadImg}`
              : `${subStyle.subImg} `
          }
          onClick={opneUpload}
        >
          <img
            src={
              subData && subData.getSubPosts.image
                ? `http://localhost:4000/public/img/${subData.getSubPosts.image}`
                : "./img/default.jpg"
            }
            alt="sub header img"
          />
        </div>
        <div className={subStyle.subTitle}>/{subname}</div>
        <div
          className={subStyle.createNewPost}
          onClick={() => navigate(`/${subname}/newPost`)}
        >
          <FaRegEdit></FaRegEdit>
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    refetch();
  }, []);
  if (error) {
    return (
      <>
        {header}
        <h5 className="errorMessage">Something went wrong...</h5>
      </>
    );
  }
  if (loading) {
    return (
      <>
        {header}
        <div className="loading"></div>
      </>
    );
  }
  if (data && data.getPostsSub.length === 0) {
    return (
      <>
        {header}
        <h5 className="errorMessage">No Posts...</h5>
      </>
    );
  }
  if (subError) {
    return (
      <>
        {header}
        <h5 className="errorMessage">Something went wrong... sub</h5>
      </>
    );
  }
  if (subLoading) {
    return (
      <>
        {header}
        <div className="loading"></div>
        <p>sub</p>
      </>
    );
  }
  if (subData) {
    console.log(subData);
  }
  // console.log(data);
  console.log(`http://localhost:4000/public/img/${subData.getSubPosts.image}`);
  return (
    <>
      {header}
      <div className={style.container}>
        <input
          type="file"
          hidden={true}
          onChange={uploadImg}
          ref={uploadInputRef}
          required
        />
        {data &&
          data.getPostsSub.map((post) => {
            const {
              uuid,
              title,
              body,
              username,
              subname,
              createdAt,
              commentsCount,
              voteValue,
              voteUser,
              user,
            } = post;
            // console.log(voteUser);
            // console.log(uuid);
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
                    <div className={`${style.postUserImgCon} `}>
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
                      className={style.commentIcon}
                      onClick={() => navigate(`/${subname}/${uuid}`)}
                    >
                      <FaRegCommentAlt /> {commentsCount} Comments
                    </div>
                  </div>
                </section>
              </article>
            );
          })}
      </div>
    </>
  );
}
