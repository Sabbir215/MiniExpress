const json = (req, res, next) => {
    let data = ``;
    req.on("data", chunk => data += chunk)
    req.on("end", () => console.log("Data End"))
    req.on("error", err => console.log(`Error from ${err}`))
}


module.exports = json;