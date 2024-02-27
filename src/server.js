import http from "node:http";

/*
- Criar usuários
- Listagem usuários
- Edição de usuários
- Remoção de usuários


*/

const tasks = [];

//const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const buffers = [];

  for await (const chunck of req) {
    buffers.push(chunck);
  }

  const body = JSON.parse(Buffer.concat(buffers).toString());
  console.log(body.title);

  //await json(req, res);

  if (method === "GET" && url === "/tasks") {
    //const tasks = database.select("tasks");
    //return res.end(JSON.stringify(tasks));
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(tasks));
  }

  if (method === "POST" && url === "/tasks") {
    //const
    tasks.push({
      id: 1,
      title: "JavaScrip",
      description: "Módulo Avançado de JavaScript Assincrono .....",
    });

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end();
});

server.listen(3335);
