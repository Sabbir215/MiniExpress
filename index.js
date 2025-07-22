const { log } = require("console");
const MiniExpress = require("./framework/main.js");
const { json, encryptPassword, assigningUserDataToTheDatabase } = require("./framework/package.js");
const app = new MiniExpress;
const indexPath = __dirname;
const port = 3000;

app.use((req, res, next) => {
    const protocol = req.socket.encrypted ? 'https' : 'http';
    const host = req.headers.host;
    log(`Request received from this URL: ${protocol}://${host}${req.url}\n\n`);
    next();
});

app.use((req, res, next) => {
    json(req, res, next);
});

// Get routes
app.get("/data", (req, res) => {
    log("GET request to /data");
    res.end("here is your data!");
});
app.get("/kata", (req, res) => {
    log("GET request to /mata");
    res.end("Kata");
});
app.get("/sata", (req, res) => {
    log("GET request to /sata");
    res.end("Sata");
});



// Post routes
app.post("/data", (req, res) => {
    log("POST request to /data");
    let postData = JSON.stringify(req.body);
    log(`Received body: ${postData}`);
    res.end(`Received body: ${postData}`);
});

app.post("/registration", (req, res) => {
    log("POST request to /registration");

    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        res.statusCode = 400;
        return res.end("All fields are required!");
    }

    const { salt, hash } = encryptPassword(password);
    assigningUserDataToTheDatabase( indexPath, name, email, salt, hash, res );


    res.end(`Registration successful! ${name}`);
});

app.listhen(port, () => {
    log(`Server is running on port ${port}`);
})