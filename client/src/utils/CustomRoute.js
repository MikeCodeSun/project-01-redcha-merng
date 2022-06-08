import React from "react";
import { useGlobleContext } from "../context/context";
import { Navigate } from "react-router-dom";

export default function CustomRoute({ children }) {
  // console.log(children);
  const { user } = useGlobleContext();
  if (children.props.auth && !user) {
    return <Navigate to="/login" />;
  } else if (children.props.guest && user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}
