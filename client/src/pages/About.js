import React from "react";
import style from "./About.module.css";

export default function About() {
  return (
    <>
      <section className={style.aboutContainer}>
        <div className={style.aboutImageContainer}>
          <img src="./img/about.jpg" alt="about" className={style.aboutImage} />
          <div className={style.aboutImageData}>
            <div className={style.aboutImageInfo}>
              <span>2022-02-22</span>
              <span>-</span>
              <span>Hello</span>
            </div>
            <h5>This is about image</h5>
          </div>
        </div>
        <div className={style.aboutContent}>
          <h3>About</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis et
            culpa ut quam officiis distinctio, quod, qui ea quasi dicta vel
            deleniti dolor doloribus rem obcaecati labore nemo quisquam commodi
            Ea?
          </p>
        </div>
      </section>
    </>
  );
}
