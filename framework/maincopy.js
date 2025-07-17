const http = require('http');

class MiniExpress {
    constructor() {
        this.middlewares = [];
        this.routes = [];
    }

    use(path, handler) {
        if (typeof path === 'function') {
            // If only handler is provided, apply to all routes
            this.middlewares.push({ path: '/', handler: path });
        } else {
            this.middlewares.push({ path, handler });
        }
    }

    // Helper to handle route registration
    _registerRoute(method, path, handler) {
        this.routes.push({ method, path, handler });
    }

    // HTTP Methods
    get(path, handler) {
        this._registerRoute('GET', path, handler);
    }

    post(path, handler) {
        this._registerRoute('POST', path, handler);
    }

    put(path, handler) {
        this._registerRoute('PUT', path, handler);
    }

    delete(path, handler) {
        this._registerRoute('DELETE', path, handler);
    }

    // Helper to parse request body
    async _parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                } catch (e) {
                    resolve(body);
                }
            });
            req.on('error', reject);
        });
    }

    // Helper to match route paths
    _matchRoute(reqPath, routePath) {
        const reqParts = reqPath.split('/').filter(Boolean);
        const routeParts = routePath.split('/').filter(Boolean);

        if (routeParts.length !== reqParts.length) return null;

        const params = {};
        
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                // This is a parameter
                params[routeParts[i].slice(1)] = reqParts[i];
            } else if (routeParts[i] !== reqParts[i]) {
                return null;
            }
        }

        return params;
    }

    // Add Express-like response helpers
    _addResponseHelpers(res) {
        res.status = function(code) {
            this.statusCode = code;
            return this;
        };

        res.json = function(data) {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(data));
        };

        res.send = function(data) {
            if (typeof data === 'string') {
                this.setHeader('Content-Type', 'text/html');
                this.end(data);
            } else {
                this.json(data);
            }
        };
    }

    // Start the server
    listen(port, callback) {
        const server = http.createServer(async (req, res) => {
            // Add response helpers
            this._addResponseHelpers(res);

            // Parse URL
            const url = new URL(req.url, `http://${req.headers.host}`);
            const pathname = url.pathname;

            // Parse query parameters
            req.query = Object.fromEntries(url.searchParams);

            // Parse body for POST/PUT requests
            if (['POST', 'PUT'].includes(req.method)) {
                req.body = await this._parseBody(req);
            }

            // Execute middlewares
            for (const middleware of this.middlewares) {
                if (pathname.startsWith(middleware.path)) {
                    await new Promise(resolve => {
                        middleware.handler(req, res, resolve);
                    });
                }
            }

            // Find matching route
            let routeFound = false;
            for (const route of this.routes) {
                if (req.method === route.method) {
                    const params = this._matchRoute(pathname, route.path);
                    if (params) {
                        req.params = params;
                        route.handler(req, res);
                        routeFound = true;
                        break;
                    }
                }
            }

            // Handle 404
            if (!routeFound) {
                res.status(404).json({ error: 'Not Found' });
            }
        });

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            if (callback) callback();
        });
    }
}

module.exports = MiniExpress;