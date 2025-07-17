// Main framework
const { log } = require("console");
const http = require("http");


class MiniExpress {
    constructor(){
        this.middlewares = [];
        this.routes = [];
    }

    handleRequest(req, res) {
        const route = this.routes.find(r => r.method === req.method && r.path === req.url);
        if (route) {
            route.handlerFn(req, res);
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    }

    use(middlewareFn) {
        this.middlewares.push(middlewareFn);
    }

    get(path, handlerFn) {
        const reqObj = {
            method: "GET",
            path: path,
            handlerFn: handlerFn
        }
        this.routes.push(reqObj);
    }

    post(path, handlerFn) {
        const reqObj = {
            method: "POST",
            path: path,
            handlerFn: handlerFn
        }
        this.routes.push(reqObj);
    }

    delete(path, handlerFn) {
        const reqObj = {
            method: "DELETE",
            path: path,
            handlerFn: handlerFn
        }
        this.routes.push(reqObj);
    }

    put(path, handlerFn) {
        const reqObj = {
            method: "PUT",
            path: path,
            handlerFn: handlerFn
        }
        this.routes.push(reqObj);
    }


    executeMiddlewares(req, res) {
        const dispatch = (index) => {
            if (index < this.middlewares.length) {
                this.middlewares[index](req, res, () => dispatch(index + 1));
            } else {
                this.handleRequest(req, res);
            }
        }
        dispatch(0);
    }

    listhen(port, callback) {
        const server = http.createServer((req, res) => {
            this.executeMiddlewares(req, res);
        })
        server.listen(port, callback);
    }
}


module.exports = MiniExpress;