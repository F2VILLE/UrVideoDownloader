require("dotenv").config()

const express = require("express"),
    app = express(),
    fs = require("fs"),
    port = process.env.PORT || 3000

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    next();
});

app.set("view engine", "pug")
app.use("/", express.static("./public"))

require("./routes")(app)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})