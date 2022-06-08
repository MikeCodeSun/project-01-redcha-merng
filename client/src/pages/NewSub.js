import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { CREATE_SUB } from "../graphql/gql";
import style from "./NewSub.module.css";
import { useNavigate } from "react-router-dom";

export default function NewSub() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const [createSub] = useMutation(CREATE_SUB, {
    variables: {
      name,
    },
    onError(err) {
      // console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      console.log(data);
      navigate(`/${data.createSub.name}`);
    },
  });
  return (
    <>
      <section className={style.newSubContainer}>
        <div className={style.newSubImgContainer}>
          <img src="./img/new-sub.jpg" alt="new sub" />
        </div>
        <div className={style.newSub}>
          <div className={style.newSubForm}>
            <div className="title">
              <h3>create new sub</h3>
              <div className="title-underline"></div>
            </div>
            <input
              type="text"
              placeholder="input new sub name"
              className={
                errors?.name
                  ? `${style.newSubInput} ${style.newSubInputError}`
                  : `${style.newSubInput}`
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors?.name && (
              <small className={style.newSubError}>{errors.name}</small>
            )}
            <button className={style.newSubBtn} onClick={createSub}>
              submit
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
