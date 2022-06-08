import React, { useState } from "react";
import style from "./Register.module.css";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/gql";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const [register] = useMutation(REGISTER, {
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
      navigate("/login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };
  return (
    <>
      <div className={style.registerContainer}>
        <form className={style.registerForm} onSubmit={handleSubmit}>
          <div className="title">
            <h4>Register</h4>
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
              htmlFor="email"
              className={
                errors?.email
                  ? `${style.registerLabel} ${style.registerAlert}`
                  : `${style.registerLabel}`
              }
            >
              {errors?.email ? errors.email : "Email:"}
            </label>
            <input
              type="email"
              id="email"
              className={
                errors?.email
                  ? `${style.registerInput} ${style.registerAlertBorder}`
                  : `${style.registerInput}`
              }
              value={registerInfo.email}
              onChange={(e) =>
                setRegisterInfo({ ...registerInfo, email: e.target.value })
              }
            />
          </div>
          <div className={style.registerControl}>
            <label
              htmlFor="image"
              className={
                errors?.image
                  ? `${style.registerLabel} ${style.registerAlert}`
                  : `${style.registerLabel}`
              }
            >
              {errors?.image ? errors.image : "Image:"}
            </label>
            <input
              type="text"
              id="image"
              className={
                errors?.image
                  ? `${style.registerInput} ${style.registerAlertBorder}`
                  : `${style.registerInput}`
              }
              value={registerInfo.image}
              onChange={(e) =>
                setRegisterInfo({ ...registerInfo, image: e.target.value })
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
