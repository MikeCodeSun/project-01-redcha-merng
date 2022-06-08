import React, { useEffect, useState } from "react";
import { useGlobleContext } from "../context/context";
import style from "./Navbar.module.css";
import { Link } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaAlignJustify,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

export default function Navbar() {
  const { theme, changeTheme } = useGlobleContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useGlobleContext();
  // console.log(user);

  useEffect(() => {
    if (theme) {
      document.body.classList.remove("theme");
    } else {
      document.body.classList.add("theme");
    }
  }, [theme]);

  return (
    <header className={style.header}>
      <nav className={style.nav}>
        <h3 className={style.logo}>
          <Link to="/">RedCha</Link>
        </h3>

        <div
          className={
            showMenu
              ? `${style.linkContainer} ${style.show}`
              : style.linkContainer
          }
        >
          <ul className={style.linkList}>
            <li>
              <Link to="/" className={style.link}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/newSub" className={style.link}>
                Sub
              </Link>
            </li>
            <li>
              <Link to="/about" className={style.link}>
                About
              </Link>
            </li>
            <li>
              <Link to={`/${user?.name}/chat`} className={style.link}>
                Chat
              </Link>
            </li>
            {!user && (
              <div className={style.linkSign}>
                <li>
                  <Link to="/login" className={style.link}>
                    sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={style.link}>
                    sign up
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
        <div className={style.btnContainer}>
          <button
            className={style.openSearchBtn}
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? <FaTimes /> : <FaSearch />}
          </button>
          <button className={style.toggleTheme} onClick={changeTheme}>
            {theme ? <FaMoon /> : <FaSun />}
          </button>
          <button
            className={style.toggleMenu}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <FaTimes /> : <FaAlignJustify />}
          </button>
          {user ? (
            <button onClick={() => setShowLogout(!showLogout)}>
              <div className={style.userImageContainer}>
                <img
                  src={user.image || "./img/default-user.jpeg"}
                  alt="userimage"
                  className={style.userImage}
                />
              </div>
            </button>
          ) : (
            <div className={style.signBtns}>
              <button
                className={style.signin}
                onClick={() => navigate("/login")}
              >
                sign in
              </button>
              <button
                className={style.signup}
                onClick={() => navigate("/register")}
              >
                <span>sign up</span>
              </button>
            </div>
          )}
        </div>
        {showSearch && <Search />}
        {showLogout && (
          <button
            className={style.logout}
            onClick={() => {
              logout();
              setShowLogout(false);
              window.location.reload();
            }}
          >
            Log out
          </button>
        )}
      </nav>
    </header>
  );
}
