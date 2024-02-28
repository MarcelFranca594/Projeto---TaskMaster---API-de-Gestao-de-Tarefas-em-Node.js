// Importando a função `parse` da biblioteca csv-parse e o módulo fs do Node.js
import { parse } from "csv-parse";
import fs from "node:fs";

// Obtendo o caminho do arquivo CSV usando a URL relativa ao módulo atual
const csvPath = new URL("./tasks.csv", import.meta.url);

// Criando um fluxo de leitura para o arquivo CSV
const stream = fs.createReadStream(csvPath);

// Configurando o parser CSV com opções como delimitador, ignorar linhas vazias e começar a partir da linha 2 (para ignorar o cabeçalho)
const csvParse = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2, // Ignora a primeira linha que contém os cabeçalhos
});

// Função assíncrona principal que executa o processamento do CSV
async function run() {
  // Criando um fluxo de leitura parseado para o CSV
  const linesParse = stream.pipe(csvParse);

  // Iterando sobre cada linha do CSV
  for await (const line of linesParse) {
    // Desestruturando a linha para obter os valores de título e descrição
    const [title, description] = line;

    // Enviando uma requisição POST para a rota /tasks com os dados de título e descrição
    await fetch("http://localhost:3335/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    // Descomente esta linha para ver a importação funcionando em câmera lenta (abrir o db.json)
    // await wait(1000)
  }
}

// Chamando a função principal para iniciar o processamento do CSV
run();

// Função para aguardar um determinado número de milissegundos
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
