const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const ROOT = path.resolve(__dirname);
const PORT = 8080;
const TIPOS = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webp": "image/webp",
};

const servidor = http.createServer((requisicao, resposta) => {
  if (requisicao.method === "GET" && requisicao.url === "/health") {
    resposta.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    });
    resposta.end(JSON.stringify({ service: "projeto-rpg-web", status: "ok" }));
    return;
  }

  if (requisicao.method !== "GET" && requisicao.method !== "HEAD") {
    resposta.writeHead(405, { Allow: "GET, HEAD" });
    resposta.end("Método não permitido.");
    return;
  }

  let caminho;
  try {
    caminho = decodeURIComponent(
      new URL(requisicao.url, "http://127.0.0.1").pathname,
    );
  } catch (erro) {
    resposta.writeHead(400);
    resposta.end("Endereço inválido.");
    return;
  }

  if (caminho === "/") caminho = "/Inicio.html";

  const arquivo = path.resolve(ROOT, `.${caminho}`);
  if (arquivo !== ROOT && !arquivo.startsWith(ROOT + path.sep)) {
    resposta.writeHead(404);
    resposta.end("Arquivo não encontrado.");
    return;
  }

  fs.stat(arquivo, (erro, estatisticas) => {
    if (erro) {
      if (erro.code === "ENOENT" || erro.code === "ENOTDIR") {
        resposta.writeHead(404);
        resposta.end("Arquivo não encontrado.");
        return;
      }

      console.error("Falha ao acessar arquivo do jogo.", erro);
      resposta.writeHead(500);
      resposta.end("Não foi possível acessar o arquivo.");
      return;
    }

    if (!estatisticas.isFile()) {
      resposta.writeHead(404);
      resposta.end("Arquivo não encontrado.");
      return;
    }

    resposta.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Length": estatisticas.size,
      "Content-Type":
        TIPOS[path.extname(arquivo).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });

    if (requisicao.method === "HEAD") {
      resposta.end();
      return;
    }

    const fluxo = fs.createReadStream(arquivo);
    fluxo.on("error", (erroFluxo) => {
      console.error("Falha ao transmitir arquivo do jogo.", erroFluxo);
      if (!resposta.headersSent) {
        resposta.writeHead(500);
        resposta.end("Não foi possível transmitir o arquivo.");
      } else {
        resposta.destroy(erroFluxo);
      }
    });
    fluxo.pipe(resposta);
  });
});

servidor.on("error", (erro) => {
  console.error("Não foi possível iniciar o servidor local.", erro);
  process.exitCode = 1;
});

servidor.listen(PORT, "127.0.0.1", () => {
  console.log(`Jogo disponível em http://127.0.0.1:${PORT}/`);
  console.log("Mantenha esta janela aberta enquanto joga.");
});
