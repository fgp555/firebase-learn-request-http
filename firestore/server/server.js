require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const auth = admin.auth();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| GET /users
|--------------------------------------------------------------------------
*/
app.get("/users", async (req, res) => {
    try {
        const result = await auth.listUsers(1000);

        const users = result.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            disabled: user.disabled,
            emailVerified: user.emailVerified,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
        }));

        res.json(users);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

/*
|--------------------------------------------------------------------------
| GET /users/:uid
|--------------------------------------------------------------------------
*/
app.get("/users/:uid", async (req, res) => {

    try {

        const user = await auth.getUser(req.params.uid);

        res.json(user);

    } catch (err) {

        res.status(404).json({
            message: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| POST /users
|--------------------------------------------------------------------------
*/
app.post("/users", async (req, res) => {

    try {

        const user = await auth.createUser({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
        });

        res.status(201).json(user);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| PATCH /users/:uid
|--------------------------------------------------------------------------
*/
app.patch("/users/:uid", async (req, res) => {

    try {

        const user = await auth.updateUser(req.params.uid, {
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
            disabled: req.body.disabled,
        });

        res.json(user);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| DELETE /users/:uid
|--------------------------------------------------------------------------
*/
app.delete("/users/:uid", async (req, res) => {

    try {

        await auth.deleteUser(req.params.uid);

        res.json({
            message: "User deleted"
        });

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});