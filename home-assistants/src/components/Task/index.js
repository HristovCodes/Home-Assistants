import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData, pullData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function Task() {
  const [tasks, setTasks] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!tasks) pullTasks("capacity", 10);
  });

  const searchTask = (query) => {
    let temp = tasks.slice();
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

  // takes care of the initial call to the db to get all the tasks
  const pullTasks = (sorting, pagination) => {
    orderData("task", sorting, pagination)
      .then((u) => {
        setTasks(u);
      })
      .catch((e) => console.log(e));
  };

  const formatTask = (tasksData) => {
    return tasksData ? (
      tasksData.map((task) => (
        <TaskRow
          key={task.name}
          data={task}
          tasks={tasks}
          setTasks={setTasks}
        ></TaskRow>
      ))
    ) : (
      <span className="datarow" key="000"></span>
    );
  };

  return (
    <div className="dbview">
      <h1>Tasks:</h1>
      <div className="buttons">
        <div>
          <label className="lbl" htmlFor="search">
            Search:
          </label>
          <input
            className="inp"
            name="search"
            type="text"
            onChange={(e) => searchTask(e.target.value)}
          ></input>
        </div>
        <Form tasks={tasks} setTasks={setTasks}></Form>
        <div>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullTasks("capacity", 10);
            }}
          >
            10
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullTasks("capacity", 25);
            }}
          >
            25
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullTasks("capacity", 50);
            }}
          >
            50
          </button>
        </div>
      </div>
      <div className="list">
        <span className="columns">
          <p>name</p>
          <p>description</p>
          <p>location</p>
          <p>dueDate</p>
          <p>budget</p>
          <p>category</p>
          <p>status</p>
          <p>Complete</p>
          <p>Delete</p>
        </span>
        {search ? formatTask(search) : formatTask(tasks)}
      </div>
    </div>
  );
}

function Form({ tasks, setTasks }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!locations) {
      pullData("location", "name").then((data) => {
        setLocations(data);
      });
    }
  });

  const addTask = (e) => {
    e.preventDefault();
    e.target.reset();

    if (name && description && location && dueDate && budget && category) {
      // create the object and push it to the db
      let data = {};
      data[name] = {
        name: name,
        description: description,
        location: location,
        dueDate: dueDate,
        budget: budget,
        category: category,
        status: "чакаща",
      };
      setData("task", data);

      // update the state with the new object so we don't have to pull whole db again
      let temp = tasks.slice();
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(name)) {
          temp[temp.indexOf(u)] = data[name];
          setTasks(temp);
          setOpen(false);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[name]);
        setTasks(temp);
        setOpen(false);
      }
    }
  };
  return (
    <div>
      <form className={open ? "form normalform" : "closed"} onSubmit={addTask}>
        <label className="lbl" htmlFor="name">
          Име:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setName(e.target.value);
          }}
          name="name"
          type="text"
        ></input>
        <label className="lbl" htmlFor="description">
          Описание:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          name="description"
          type="text"
        ></input>

        <label className="lbl" htmlFor="location">
          Локация:
        </label>
        <select
          className="inp"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          name="location"
        >
          <option value=""></option>
          {Object.values(locations).map((e) => {
            return <option value={e.adress}>{e.adress}</option>;
          })}
        </select>
        <label className="lbl" htmlFor="duedate">
          Срок:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setDueDate(e.target.value);
          }}
          name="duedate"
          type="date"
        ></input>
        <label className="lbl" htmlFor="budget">
          Бюджет:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setBudget(e.target.value);
          }}
          name="budget"
          type="text"
        ></input>
        <label className="lbl" htmlFor="category">
          Категория:
        </label>
        <select
          className="inp"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          name="category"
        >
          <option value=""></option>
          <option value="почистване и дизенфекция">
            почистване и дизенфекция
          </option>
          <option value="грижа за домашни любимци и растения">
            грижа за домашни любимци и растения
          </option>
          <option value="грижа за дете">грижа за дете</option>
          <option value="грижа за възрастен човек">
            грижа за възрастен човек
          </option>
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
        {open ? "Close form" : "Add/Edit client"}
      </button>
    </div>
  );
}

function TaskRow({ data, tasks, setTasks }) {
  return (
    <span className="datarow">
      <p>{data.name}</p>
      <p>{data.description}</p>
      <p>{data.location}</p>
      <p>{data.dueDate}</p>
      <p>{data.budget}</p>
      <p>{data.category}</p>
      <p>{data.status}</p>
      {data.status !== "Изпълнена" ? (
        <p
          className="action clickable"
          onClick={() => {
            data.status = "Изпълнена";
            let obj = {};
            obj[data.name] = data;
            setData("task", obj);

            let temp = tasks.slice();
            temp.splice(temp.indexOf(data), 1);
            temp.push(data);
            setTasks(temp);
          }}
        >
          Complete
        </p>
      ) : (
        <p>-</p>
      )}
      <p
        className="action clickable"
        onClick={() => {
          deleteData("task", data.name);
          let temp = tasks.slice();
          temp.splice(temp.indexOf(data), 1);
          setTasks(temp);
        }}
      >
        Delete
      </p>
    </span>
  );
}
