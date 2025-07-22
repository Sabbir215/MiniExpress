const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const log = console.log;

const json = (req, res, next) => {
    let data = ``;
    req.on("data", chunk => data += chunk)
    req.on("end", () => {
        try {
            req.body = JSON.parse(data);
            console.log(`Parsed JSON: ${JSON.stringify(req.body)}`);
            next();
        } catch (err) {
            res.statusCode = 400;
            res.end('Invalid JSON');
        }
    })
}

const encryptPassword = (password) => {

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');

    return {
        salt: salt,
        hash: hash
    }
}

const registration = (indexPath, name, email, salt, hash, res) => {
    fs.readFile(path.join(indexPath, "database/users.json"), (err, data) => {
        if (err) {
            log("Error reading users.json:", err);
            res.statusCode = 500;
            return res.end("Internal server error");
        }

        const newUser = { name, email, hash, salt };
        let users = data.length > 0 ? JSON.parse(data) : [];
        users.push(newUser);
        log("New user data:", newUser);

        fs.writeFile(path.join(indexPath, "database/users.json"), JSON.stringify(users, [ "name", "email", "hash", "salt" ], 2), (err) => {
            if (err) {
                log("Error writing to users.json:", err);
                res.statusCode = 500;
                return res.end("Internal server error");
            }
        });

        res.end(`Registration successful! ${name}`);
    })
}

const login = (indexPath, email, password, res) => {
    fs.readFile(path.join(indexPath, "database/users.json"), (err, data) => {
        if (err) {
            log("Error reading users.json:", err);
            res.statusCode = 500;
            return res.end("Internal server error");
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.email === email || u.name === email);

        if (!user) {
            res.statusCode = 404;
            return res.end("User not found");
        }

        const hash = crypto.scryptSync(password, user.salt, 64).toString('hex');
        if (hash !== user.hash) {
            res.statusCode = 401;
            return res.end("Invalid password");
        }

        res.end(`Login successful! Welcome ${user.name}`);
    });
}

    


module.exports = { json, encryptPassword, registration, login };