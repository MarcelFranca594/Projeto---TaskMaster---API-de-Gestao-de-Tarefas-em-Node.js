/*
export async function json(req, res) {
  const buffers = [];

  for await (const chunck of req) {
    buffers.push(chunck);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString()); // converte essa string em um objeto JavaScript, interpretando-a como um JSON válido
    //console.log(body);
  } catch {
    req.body = null;
  }
  res.setHeader("Content-type", "application/json");
}
*/
