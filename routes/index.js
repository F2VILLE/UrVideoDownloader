const fs = require("fs")

module.exports = (app) => {
    for (const route of fs.readdirSync("./routes").filter(x => !["index.js"].includes(x))) {
        const prop = require("./" + route)
        app.use((prop.path || "/" + route.split(".").shift()), prop.router)
    }
}