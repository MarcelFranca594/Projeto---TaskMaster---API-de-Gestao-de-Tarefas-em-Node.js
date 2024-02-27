import http from "node:http";
import { json } from "./middleware/json.js";
import { routes } from "./router.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

/*
- Criar usuários
- Listagem usuários
- Edição de usuários
- Remoção de usuários


*/

//const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req; // Extrai o método e a URL da requisição.

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  // Verificação única - Para encontrar a rota correta
  if (route) {
    const routeParams = req.url.match(route.path);

    ///console.log(extractQueryParams(routeParams.groups.query));

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    //console.log(params);

    return route.handler(req, res);
  }
  // console.log(route);
  return res.writeHead(404).end("Not Found");
});

server.listen(3335);
