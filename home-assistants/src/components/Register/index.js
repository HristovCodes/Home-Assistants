import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase, { setData } from "../../firebase.js";
import "./styles.scss";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  const registerUser = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let data = {};
        data[`${firstName}${lastName}`] = {
          email: email,
          firstname: firstName,
          lastname: lastName,
          role: "Client",
        };
        setData("user", data);
        var user = userCredential.user;
        if (user) {
          history.replace("/Home-Assistants/");
        }
      })
      .catch((e) => {
        console.log(e.code);
        console.log(e.message);
      });
  };

  return (
    <div className="register">
      <form className="registerform" onSubmit={registerUser}>
        <h1>HOME ASSISTANTS</h1>
        <div>
          <h2>Моля регистрирайте се</h2>
          <input
            className="inp"
            onChange={(e) => setFirstName(e.target.value)}
            required={true}
            type="text"
            placeholder="Jhon"
          ></input>
          <input
            className="inp"
            onChange={(e) => setLastName(e.target.value)}
            required={true}
            type="text"
            placeholder="Wick"
          ></input>
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
            Регистрация
          </button>
          <button
            onClick={() => {
              history.replace("/Home-Assistants/Login");
            }}
            className="btn"
            type="button"
          >
            Към Вход
          </button>
        </div>
      </form>
    </div>
  );
}
