import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

// Array de Rotas - Todas as rotas de minha aplicação - cada rota vai ser um objeto
export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  // Mais uma rota na aplicação
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { name, email } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
      //.whiteHead => informa o http status code | 201 Created
      //return res.end("Criação de usuário");
    },
  },
];
