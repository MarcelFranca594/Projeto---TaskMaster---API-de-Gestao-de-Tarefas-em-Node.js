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

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });
      return res.end(JSON.stringify(tasks));
    },
  },
  // Mais uma rota na aplicação
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Title são campos obrigatórios." }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Description são campos obrigatórios." })
          );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
      //.whiteHead => informa o http status code | 201 Created
      //return res.end("Criação de usuário");
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title e Description são campos obrigatórios.",
          })
        );
      }

      // Verifica se o ID da task existe no banco de dados
      const [task] = database.findById("tasks", { id });
      if (!task) {
        return res.writeHead(404).end("Task não encontrada.");
      }

      database.update("tasks", id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      // Verifica se o ID da task existe no banco de dados
      const [task] = database.findById("tasks", { id });
      if (!task) {
        // Se a task não for encontrada, retorna uma resposta com status 404 (Not Found)
        return res.writeHead(404).end("Task não encontrada.");
      }

      // Se a task existir, proceda com a remoção
      database.delete("tasks", id);

      return res.writeHead(204).end(); // 204 => Deu certo, mas não tem msg de conteudo
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      // Verifica se o ID da task existe no banco de dados
      const [task] = database.findById("tasks", { id });
      if (!task) {
        // Se a task não for encontrada, retorna uma resposta com status 404 (Not Found)
        return res.writeHead(404).end("Task não encontrada.");
      }

      // Determina o novo estado de conclusão da task
      const isTaskCompleted = !!task.completed_at;
      const completed_at = isTaskCompleted ? null : new Date();

      // Atualiza a task no banco de dados com o novo estado de conclusão
      database.update("task", id, {
        completed_at,
      });

      return res.writeHead(204).end(); // 204 => Deu certo, mas não tem msg de conteudo
    },
  },
];
