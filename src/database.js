import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  // Define um método para selecionar dados de uma tabela.
  // Filtrando lista do banco de dados
  select(table, search) {
    let data = this.#database[table] ?? []; // Obtém os dados da tabela especificada, se não houver dados, retorna um array vazio.

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true;

          return row[key].includes(value);
        });
      });
    }

    return data; // Retorna os dados obtidos.
  }

  // Define um método para inserir dados em uma tabela.
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      // // Verifica se já existe uma entrada para a tabela no banco de dados.
      this.#database[table].push(data); // // Se existir, adiciona os novos dados ao array existente
    } else {
      //// Se não existir uma entrada para a tabela no banco de dados.
      this.#database[table] = [data]; // // Cria uma nova entrada para a tabela e insere os dados como um array.
    }

    this.#persist(); // Persiste os dados no arquivo "db.json".

    return;
  }

  uptade(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table][rowIndex].findIndex(
      (row) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
