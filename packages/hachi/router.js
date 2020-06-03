import { matchRoutes } from 'react-router-config';

export default class Router {
    constructor(routes) {
        this.routes = routes;
    }

    async execute(req, res, parsedUrl, app) {
        this.renderToHTML(req, res, parsedUrl.pathname, parsedUrl.query)

    }

    async renderToHTML(req, res, pathname, query) {
        await findPageComponents(pathname, query);
    }

    async findPageComponents(pathname, query) {
        
    }
}