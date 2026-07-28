require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./serviceAccountKey.json");


initializeApp({
  credential: cert(serviceAccount),
});


const firebaseAuth = getAuth();


const app = express();

app.use(express.json());
app.use(morgan("dev"));


const PORT = process.env.PORT || 3000;


/*
#################################
# GET ALL USERS
#################################
*/
app.get("/users", async (req, res) => {
  try {

    const result = await firebaseAuth.listUsers(1000);

    res.json(result.users);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
});


/*
#################################
# GET USER BY UID
#################################
*/
app.get("/users/:uid", async (req, res) => {
  try {

    const user = await firebaseAuth.getUser(req.params.uid);

    res.json(user);

  } catch (error) {

    res.status(404).json({
      error: error.message,
    });

  }
});


/*
#################################
# CREATE USER
#################################
*/
app.post("/users", async (req, res) => {
  try {

    const user = await firebaseAuth.createUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      emailVerified: false,
      disabled: false,
    });


    res.status(201).json(user);


  } catch (error) {

    res.status(400).json({
      error: error.message,
    });

  }
});


/*
#################################
# UPDATE USER
#################################
*/
app.patch("/users/:uid", async (req, res) => {

  try {

    const user = await firebaseAuth.updateUser(
      req.params.uid,
      {
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
        disabled: req.body.disabled,
      }
    );


    res.json(user);


  } catch (error) {

    res.status(400).json({
      error: error.message,
    });

  }

});


/*
#################################
# DELETE USER
#################################
*/
app.delete("/users/:uid", async (req, res) => {

  try {

    await firebaseAuth.deleteUser(req.params.uid);

    res.json({
      message: "User deleted",
      uid: req.params.uid,
    });


  } catch (error) {

    res.status(404).json({
      error: error.message,
    });

  }

});


app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});