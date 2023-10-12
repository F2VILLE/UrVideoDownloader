require("dotenv").config()

const express = require("express"),
    app = express(),
    fs = require("fs"),
    port = process.env.PORT || 3000

app.set("view engine", "pug")
app.use("/", express.static("./public"))

require("./routes")(app)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})