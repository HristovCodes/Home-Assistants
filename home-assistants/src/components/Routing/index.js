import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import firebase from "../../firebase.js";
import User from "../User/index";
import Task from "../Task/index";
import Location from "../Location/index";
import NoMatch from "../NoMatch/index";
import Login from "../Login/index";
import Register from "../Register/index";
import Main from "../Main/index";
import "./styles.scss";
import "normalize.css";

export default function Routing() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        // User is signed in.
        setUser(u);
      } else {
        setUser("anon");
      }
    });
  });

  return (
    <Router>
      <div className="routing">
        <Switch>
          <Route exact path="/">
            <Redirect to="/Home-Assistants/"></Redirect>
          </Route>
          <PrivateRoute user={user} exact path="/Home-Assistants/">
            <Main></Main>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Home-Assistants/User">
            <User></User>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Home-Assistants/Location">
            <Location></Location>
          </PrivateRoute>
          <PrivateRoute user={user} path="/Home-Assistants/Task">
            <Task></Task>
          </PrivateRoute>
          <Route path="/Home-Assistants/Login">
            <Login></Login>
          </Route>
          <Route path="/Home-Assistants/Register">
            <Register></Register>
          </Route>
          <Route path="*">
            <NoMatch></NoMatch>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function PrivateRoute({ user, children, ...rest }) {
  if (user)
    return (
      <Route {...rest}>
        {user !== "anon" && user ? (
          children
        ) : (
          <Redirect to={"/Home-Assistants/Login"}></Redirect>
        )}
      </Route>
    );
  return null;
}
