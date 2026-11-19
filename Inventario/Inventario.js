
document.addEventListener("DOMContentLoaded", () => {

    const grade = document.getElementById("gradeItens");
    const vazio = document.getElementById("inventarioVazio");
    const total = document.getElementById("totalItens");
    const filtros = document.querySelectorAll(".filtro");

    let categoriaAtual = "todos";

    // Carrega os itens armazenados no inventário
    function carregarInventario() {

        const itens = window.InventarioLoja.listar();

        // Soma a quantidade total de itens
        total.textContent = itens.reduce(
            (soma, item) => soma + item.quantidade,
            0
        );

        // Aplica o filtro selecionado
        const filtrados = categoriaAtual === "todos"
            ? itens
            : itens.filter(item => item.categoria === categoriaAtual);

        grade.innerHTML = "";

        vazio.hidden = filtrados.length > 0;
        grade.hidden = filtrados.length === 0;

        // Cria os cartões dos itens
        filtrados.forEach(item => {

            const card = document.createElement("article");
            card.className = "item-card";

            const imagem = document.createElement("img");
            imagem.className = "item-imagem";
            imagem.alt = item.nome;
            imagem.src = item.imagem || "";

            imagem.onerror = () => {
                imagem.style.visibility = "hidden";
            };

            const nome = document.createElement("h2");
            nome.textContent = item.nome;

            const categoria = document.createElement("p");
            categoria.className = "item-categoria";
            categoria.textContent = item.categoria;

            const quantidade = document.createElement("span");
            quantidade.className = "item-quantidade";
            quantidade.textContent = `Quantidade: ${item.quantidade}`;

            const preco = document.createElement("p");
            preco.className = "item-preco";
            preco.textContent =
                `Preço unitário: ${Number(item.preco).toLocaleString("pt-BR")} moedas`;

            card.append(
                imagem,
                nome,
                categoria,
                quantidade,
                preco
            );

            grade.appendChild(card);
        });
    }

    // Filtros por categoria
    filtros.forEach(botao => {

        botao.addEventListener("click", () => {

            filtros.forEach(f => f.classList.remove("ativo"));

            botao.classList.add("ativo");

            categoriaAtual = botao.dataset.categoria;

            carregarInventario();
        });
    });

    // BOTÃO VOLTAR: direciona para TelaInicial2.html
    document.getElementById("btnVoltar").addEventListener("click", () => {

        window.location.href = "../TelaInicial2.html";

    });

    // BOTÃO VISITAR MERCADO
    document.getElementById("btnLoja").addEventListener("click", () => {

        window.location.href = "./TelaLoja.html";

    });

    // Atualiza o inventário quando algum item é comprado
    window.addEventListener("inventarioAtualizado", carregarInventario);

    // Carrega o inventário ao abrir a página
    carregarInventario();

});
