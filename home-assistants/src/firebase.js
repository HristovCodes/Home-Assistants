import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgEkkojV0tUc9Uzo0uKTNhXf_pQ5Xia14",
  authDomain: "home-assistants-1fccc.firebaseapp.com",
  databaseURL:
    "https://home-assistants-1fccc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "home-assistants-1fccc",
  storageBucket: "home-assistants-1fccc.appspot.com",
  messagingSenderId: "666388505376",
  appId: "1:666388505376:web:62347de6465923e5016d45",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export function setData(path, data) {
  firebase
    .database()
    .ref(`${path}/`)
    .update(data)
    .catch((e) => console.log(`${e.code}\n${e.message}`));
}

export async function deleteData(path, id) {
  firebase
    .database()
    .ref(`${path}/${id}`)
    .remove()
    .catch((e) => console.log(e.message));
}

export async function orderData(path, query, ammount) {
  let response = await firebase
    .database()
    .ref(`${path}/`)
    .orderByChild(query)
    .limitToFirst(ammount)
    .once("value");

  if (response.code) {
    throw new Error(response.code);
  } else {
    const data = [];
    response.forEach((v) => {
      data.push(v.val());
    });
    return data;
  }
}

export async function pullData(path, query) {
  let response = await firebase
    .database()
    .ref(`${path}/`)
    .orderByChild(query)
    .once("value");

  if (response.code) {
    throw new Error(response.code);
  } else {
    const data = [];
    response.forEach((v) => {
      data.push(v.val());
    });
    return data;
  }
}

export async function pullUserData(id) {
  let response = await firebase.database().ref(`user/${id}/`).once("value");

  if (response.code) {
    throw new Error(response.code);
  } else {
    const data = [];
    response.forEach((v) => {
      data.push(v.val());
    });
    return data;
  }
}

const firebaseInstance = {
  database: firebase.database,
  auth: firebase.auth,
};

export default firebaseInstance;
