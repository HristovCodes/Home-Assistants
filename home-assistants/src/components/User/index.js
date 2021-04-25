import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function User() {
  const [users, setUsers] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!users) pullUsers("id", 10);
  });

  const searchUser = (query) => {
    let temp = users.slice();
    let matches = [];
    temp.forEach((u) => {
      if (Object.values(u).includes(query)) {
        matches.push(u);
      }
    });
    if (matches.length > 0) {
      return setSearch(matches);
    }
    setSearch(undefined);
  };

  // takes care of the initial call to the db to get all the users
  const pullUsers = (sorting, pagination) => {
    orderData("user", sorting, pagination)
      .then((u) => {
        setUsers(u);
      })
      .catch((e) => console.log(e));
  };

  const formatUser = (usersData) => {
    return usersData ? (
      usersData.map((user) => (
        <UserRow
          key={`${user.firstName}${user.lastName}`}
          data={user}
          users={users}
          setUsers={setUsers}
        ></UserRow>
      ))
    ) : (
      <span className="datarow" key="000"></span>
    );
  };

  return (
    <div className="dbview">
      <h1>Users:</h1>
      <div className="buttons">
        <div>
          <label className="lbl" htmlFor="search">
            Search:
          </label>
          <input
            className="inp"
            name="search"
            type="text"
            onChange={(e) => searchUser(e.target.value)}
          ></input>
        </div>
        <Form users={users} setUsers={setUsers}></Form>
        <div>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullUsers("firstName", 10);
            }}
          >
            10
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullUsers("firstName", 25);
            }}
          >
            25
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullUsers("firstName", 50);
            }}
          >
            50
          </button>
        </div>
      </div>
      <div className="list">
        <span className="columns">
          <p>email</p>
          <p>firstName</p>
          <p>lastName</p>
          <p>role</p>
          <p>Delete</p>
        </span>
        {search ? formatUser(search) : formatUser(users)}
      </div>
    </div>
  );
}

function Form({ users, setUsers }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const addUser = (e) => {
    e.preventDefault();
    e.target.reset();

    if (firstName && lastName && email) {
      // create the object and push it to the db
      let data = {};
      data[`${firstName}${lastName}`] = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        role: role,
      };
      setData("user", data);

      // update the state with the new object so we don't have to pull whole db again
      let temp = users.slice();
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(email)) {
          temp[temp.indexOf(u)] = data[`${firstName}${lastName}`];
          setUsers(temp);
          setOpen(false);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[`${firstName}${lastName}`]);
        setUsers(temp);
        setOpen(false);
      }
    }
  };

  return (
    <div>
      <form className={open ? "form normalform" : "closed"} onSubmit={addUser}>
        <label className="lbl" htmlFor="firstName">
          Име:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          name="firstName"
          type="text"
        ></input>
        <label className="lbl" htmlFor="lastName">
          Фамилно име:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          name="lastName"
          type="text"
        ></input>
        <label className="lbl" htmlFor="email">
          Имейл:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          name="email"
          type="text"
        ></input>
        <label className="lbl" htmlFor="role">
          Роля:
        </label>
        <select
          className="inp"
          onChange={(e) => {
            setRole(e.target.value);
          }}
          name="category"
        >
          <option value="Administrator">Administrator</option>
          <option value="Housekeeper">Housekeeper</option>
          <option value="Client">Client</option>
        </select>
        <button className="btn formbtn" type="submit">
          Добави
        </button>
      </form>
      <button
        className="btn addedit"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? "Close form" : "Add/Edit user"}
      </button>
    </div>
  );
}

function UserRow({ data, users, setUsers }) {
  let id = `${data.firstname}${data.lastname}`;
  return (
    <span className="datarow">
      <p>{data.email}</p>
      <p>{data.firstname}</p>
      <p>{data.lastname}</p>
      <p>{data.role}</p>
      <p
        className="action"
        onClick={() => {
          deleteData("user", id);
          let temp = users.slice();
          temp.splice(temp.indexOf(data), 1);
          setUsers(temp);
        }}
      >
        Delete
      </p>
    </span>
  );
}
