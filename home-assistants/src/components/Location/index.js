import React, { useEffect, useState } from "react";
import { orderData, setData, deleteData } from "../../firebase";
import "../SharedStyles/styles.scss";

export default function Location() {
  const [locations, setLocations] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    if (!locations) pullLocations("capacity", 10);
  });

  const searchLocation = (query) => {
    let temp = locations.slice();
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

  // takes care of the initial call to the db to get all the locations
  const pullLocations = (sorting, pagination) => {
    orderData("location", sorting, pagination)
      .then((u) => {
        setLocations(u);
      })
      .catch((e) => console.log(e));
  };

  const formatLocation = (locationsData) => {
    return locationsData ? (
      locationsData.map((location) => (
        <LocationRow
          key={location.id}
          data={location}
          locations={locations}
          setLocations={setLocations}
        ></LocationRow>
      ))
    ) : (
      <span className="datarow" key="000"></span>
    );
  };

  return (
    <div className="dbview">
      <h1>Locations:</h1>
      <div className="buttons">
        <div>
          <label className="lbl" htmlFor="search">
            Search:
          </label>
          <input
            className="inp"
            name="search"
            type="text"
            onChange={(e) => searchLocation(e.target.value)}
          ></input>
        </div>
        <Form locations={locations} setLocations={setLocations}></Form>
        <div>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullLocations("adress", 10);
            }}
          >
            10
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullLocations("adress", 25);
            }}
          >
            25
          </button>
          <button
            className="btn count"
            type="button"
            onClick={() => {
              pullLocations("adress", 50);
            }}
          >
            50
          </button>
        </div>
      </div>
      <div className="list">
        <span className="columns">
          <p>name</p>
          <p>adress</p>
          <p>Delete</p>
        </span>
        {search ? formatLocation(search) : formatLocation(locations)}
      </div>
    </div>
  );
}

function Form({ locations, setLocations }) {
  const [open, setOpen] = useState(false);
  const [adress, setAdress] = useState("");
  const [name, setName] = useState("");

  const addLocation = (e) => {
    e.preventDefault();
    e.target.reset();

    if (adress && name) {
      // create the object and push it to the db
      let data = {};
      data[adress] = {
        adress: adress,
        name: name,
      };
      setData("location", data);

      console.log(locations);
      // update the state with the new object so we don't have to pull whole db again
      let temp = locations.slice();
      let match = false;
      temp.forEach((u) => {
        if (Object.values(u).includes(adress)) {
          temp[temp.indexOf(u)] = data[adress];
          setLocations(temp);
          setOpen(false);
          match = true;
        }
      });
      if (!match) {
        temp.push(data[adress]);
        setLocations(temp);
        setOpen(false);
      }
    }
  };
  return (
    <div>
      <form
        className={open ? "form normalform" : "closed"}
        onSubmit={addLocation}
      >
        <label className="lbl" htmlFor="location">
          Локация:
        </label>
        <input
          className="inp"
          onChange={(e) => {
            setAdress(e.target.value);
          }}
          name="location"
          type="text"
        ></input>
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
        {open ? "Close form" : "Add/Edit location"}
      </button>
    </div>
  );
}

function LocationRow({ data, locations, setLocations }) {
  return (
    <span className="datarow">
      <p>{data.name}</p>
      <p>{data.adress}</p>
      <p
        className="action clickable"
        onClick={() => {
          deleteData("location", data.adress);
          let temp = locations.slice();
          temp.splice(temp.indexOf(data), 1);
          setLocations(temp);
        }}
      >
        Delete
      </p>
    </span>
  );
}
