const json = (req, res, next) => {
    let data = ``;
    req.on("data", chunk => data += chunk)
    req.on("end", () => {
        try {
            req.body = JSON.parse(data);
            next();
        } catch (err) {
            res.statusCode = 400;
            res.end('Invalid JSON');
        }
        console.log(res.body);
    })
}


module.exports = json;