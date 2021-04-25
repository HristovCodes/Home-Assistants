import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase.js";
import "./styles.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  const loginUser = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            history.replace("/Home-Assistants/");
          }
        });
      })
      .catch((e) => {
        console.log(e.code);
        console.log(e.message);
      });
  };

  return (
    <div className="login">
      <form className="loginform" onSubmit={loginUser}>
        <h1>HOME ASSISTANTS</h1>
        <div>
          <h2>Моля влезте във вашият акаунт</h2>
          <input
            className="inp"
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            type="email"
            placeholder="examplemail@provider.com"
          ></input>
          <input
            className="inp"
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            type="password"
            placeholder="password"
          ></input>
          <button className="btn" type="submit">
            Вход
          </button>
          <button
            onClick={() => {
              history.replace("/Home-Assistants/Register");
            }}
            className="btn"
            type="submit"
          >
            Към Регистрация
          </button>
        </div>
      </form>
    </div>
  );
}
