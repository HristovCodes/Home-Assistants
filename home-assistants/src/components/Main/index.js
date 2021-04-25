import React from "react";
import { Link } from "react-router-dom";
import firebaseInstance from "../../firebase";
import "./styles.scss";

export default function Main() {
  return (
    <div className="main">
      <ul>
        <li>
          <Link to="/Home-Assistants/User">Users Database</Link>
        </li>
        <li>
          <Link to="/Home-Assistants/Location">Locations Database</Link>
        </li>
        <li>
          <Link to="/Home-Assistants/Task">Tasks Database</Link>
        </li>
      </ul>
      <button
        className="btn"
        onClick={() => {
          firebaseInstance.auth().signOut();
        }}
        type="button"
      >
        Log Out
      </button>
    </div>
  );
}
