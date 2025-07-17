const { log } = require("console");
const MiniExpress = require("./framework/main.js");
const app = new MiniExpress;
const port = 3000;

app.use((req, res, next) => {
    log(`Request received from this URL: ${req.url}`);
    next(); // Call the next middleware or route handler
});

app.use((req, res, next) => {
    log(`Lol, is it working?`);
    next(); // Call the next middleware or route handler
});

app.use((req, res, next) => {
    log(`Lol, maybe it is working?`);
    // next(); // Call the next middleware or route handler
});

// Get routes
app.get("/data", (req, res) => {
    log("GET request to /data");
    res.end("Hello, World!");
});
app.get("/kata", (req, res) => {
    log("GET request to /mata");
    res.end("Hello, World!");
});
app.get("/sata", (req, res) => {
    log("GET request to /sata");
    res.end("Hello, World!");
});

app.listhen(port, () => {
    log(`Server is running on port ${port}`);
})