import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { SEARCH_SUB } from "../graphql/gql";
import style from "./Search.module.css";
import { Link } from "react-router-dom";

export default function Search() {
  const [name, setName] = useState("");
  const [subList, setSubList] = useState([]);

  const [searchSub] = useMutation(SEARCH_SUB, {
    onError(err) {
      console.log(err);
    },
    onCompleted(data) {
      setSubList(data.searchSub);
    },
  });
  const handleSubmit = (value) => {
    setName(value);
    if (!value || value.trim() === "") return;

    searchSub({ variables: { name: value } });
  };
  useEffect(() => {
    console.log("e");
    if (!name || name.trim() === "") {
      console.log("ei");
      setSubList([]);
    }
  }, [name]);
  console.log(subList);
  return (
    <>
      <div className={style.searchContainer}>
        <div className={style.searchForm}>
          <div className={style.searchControl}>
            <input
              type="text"
              placeholder="search sub ..."
              className={style.searchInput}
              value={name}
              onChange={(e) => handleSubmit(e.target.value)}
            />
            <button className={style.searchBtn}>
              <FaSearch />
            </button>
            {subList.length > 0 && (
              <div className={style.searchList}>
                {subList.map((sub) => {
                  const { uuid, name } = sub;
                  return (
                    <Link
                      to={`/${name}`}
                      key={uuid}
                      onClick={() => {
                        setSubList([]);
                        setName("");
                      }}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
