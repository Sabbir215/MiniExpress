const { log } = require("console");
const MiniExpress = require("./framework/main.js");
const json = require("./framework/package.js");
const app = new MiniExpress;
const port = 3000;

app.use((req, res, next) => {
    log(`Request received from this URL: ${req.url}\n\n`);
    next();
});

app.use((req, res, next) => {
    log(`Lol, is it working?`);
    next();
});

app.use((req, res, next) => {
    log(`Lol, maybe it is working?\n\n`);
    next();
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

app.use((req, res, next) => {
    json(req, res, next);
    log("JSON middleware executed");
    next();
});

// Post routes
app.post("/data", (req, res) => {
    log("POST request to /data");
    res.end("Data received!");
});

app.listhen(port, () => {
    log(`Server is running on port ${port}`);
})