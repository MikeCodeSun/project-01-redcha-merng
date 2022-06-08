import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState, u } from "react";
import { CREATE_VOTE, GET_ALL_POSTS } from "../graphql/gql";
import style from "./Posts.module.css";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { FaRegCommentAlt } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useGlobleContext } from "../context/context";
dayjs.extend(relativeTime);

export default function Posts() {
  const [page, setPage] = useState(0);
  const [obID, setObId] = useState("");
  const [noPosts, setNoPosts] = useState(false);
  const { allPosts, getAllPosts, changeVote } = useGlobleContext();

  console.log(allPosts);
  const navigate = useNavigate();
  // get posts all
  const { data, error, loading } = useQuery(GET_ALL_POSTS, {
    variables: {
      limit: 8,
      offset: 8 * page,
    },
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      console.log(data);
      // setAllPostList(data.getAllPosts);
      // setAllPostList([...allPostList, ...data.getAllPosts]);
      getAllPosts([...allPosts, ...data.getAllPosts]);
      if (data.getAllPosts.length === 0) {
        setNoPosts(true);
      }
      // if (data.getAllPosts.length > 0) {
      //   const dataUUID = data.getAllPosts[data.getAllPosts.length - 1].uuid;
      //   if (obID !== dataUUID) {
      //     setAllPostList([...allPostList, ...data.getAllPosts]);
      //     setObId(dataUUID);
      //     setNoPosts(false);
      //     // handleScroll();
      //   }
      // } else {
      //   setNoPosts(true);
      // }
    },
  });

  // scroll to bottom
  // function handleScroll() {
  //   window.scroll({
  //     top: document.body.offsetHeight,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }

  // vote post
  const [createVote] = useMutation(CREATE_VOTE, {
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      // console.log(data.createVote);
      changeVote(data.createVote);
      // create vote then update all posts
      // const newPosts = allPosts.map((post) => {
      //   if (post.uuid === data.createVote.postuuid) {
      //     console.log("post");
      //     if (data.createVote.value === post.voteUser) {
      //       console.log("same");
      //       return {
      //         ...post,
      //         voteUser: null,
      //         voteValue: post.voteValue - post.voteUser,
      //       };
      //     } else {
      //       console.log("dif");
      //       return {
      //         ...post,
      //         voteUser: data.createVote.value,
      //         voteValue: post.voteValue + data.createVote.value,
      //       };
      //     }
      //   }
      //   return post;
      // });
      // getAllPosts(newPosts);
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

  // observer begin
  const obeservePost = (element) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("ob");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      {
        threshold: 1,
      }
    );
    observer.observe(element);
  };
  // reload?

  // ob eff
  useEffect(() => {
    if (allPosts.length > 0) {
      const elementID = allPosts[allPosts.length - 1].uuid;
      const element = document.getElementById(elementID);

      if (obID !== elementID) {
        obeservePost(element);
        setObId(elementID);
      }
    }
  }, [allPosts]);

  if (error) {
    return <h5 className="errorMessage">Something went wrong...</h5>;
  }
  if (loading) {
    return <div className="loading"></div>;
  }
  if (allPosts.length === 0) {
    return <h5 className="errorMessage">No Posts...</h5>;
  }
  // console.log(data);
  return (
    <div className={style.container}>
      {/* <button
        onClick={() => {
          setPage(page + 1);
        }}
      >
        next Page
      </button> */}

      {data &&
        allPosts.map((post) => {
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
            <article key={uuid} className={style.singleContainer} id={uuid}>
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
      {noPosts && <p className="errorMessage">no posts left...</p>}
    </div>
  );
}
