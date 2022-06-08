import React, { useState } from "react";
import style from "./Register.module.css";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/gql";
import { useNavigate } from "react-router-dom";
import { useGlobleContext } from "../context/context";

export default function Login() {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const context = useGlobleContext();
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN, {
    variables: {
      input: {
        ...registerInfo,
      },
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted: (data) => {
      console.log(data);
      context.login(data.login);
      navigate("/");
      window.location.reload();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };
  return (
    <>
      <div className={style.registerContainer}>
        <form className={style.registerForm} onSubmit={handleSubmit}>
          <div className="title">
            <h4>Log In</h4>
            <div className="title-underline"></div>
          </div>
          <div className={style.registerControl}>
            <label
              htmlFor="name"
              className={
                errors?.name
                  ? `${style.registerLabel} ${style.registerAlert}`
                  : `${style.registerLabel}`
              }
            >
              {errors?.name ? errors.name : "Name:"}
            </label>
            <input
              type="text"
              id="name"
              className={
                errors?.name
                  ? `${style.registerInput} ${style.registerAlertBorder}`
                  : `${style.registerInput}`
              }
              value={registerInfo.name}
              onChange={(e) =>
                setRegisterInfo({ ...registerInfo, name: e.target.value })
              }
            />
          </div>
          <div className={style.registerControl}>
            <label
              htmlFor="password"
              className={
                errors?.password
                  ? `${style.registerLabel} ${style.registerAlert}`
                  : `${style.registerLabel}`
              }
            >
              {errors?.password ? errors.password : "password:"}
            </label>
            <input
              type="password"
              id="password"
              className={
                errors?.password
                  ? `${style.registerInput} ${style.registerAlertBorder}`
                  : `${style.registerInput}`
              }
              value={registerInfo.password}
              onChange={(e) =>
                setRegisterInfo({ ...registerInfo, password: e.target.value })
              }
            />
          </div>
          <div className={style.registerControl}>
            <button className={style.registerBtn}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
