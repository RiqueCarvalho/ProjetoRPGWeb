
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const RECOMPENSA_VITORIA = 500;
    const CHAVE_VITORIA = "arenaI_vitoria_registrada";

    const PAGINA_CREDITOS = "../the-last-kingdom-com-creditos.html";

    // ==========================================
    // ELEMENTOS HTML
    // ==========================================

    const elementos = {
        valorAtaque: document.getElementById("valorAtaque"),
        moedas: document.getElementById("moedas"),
        nomeUsuario: document.getElementById("nomeUsuario"),

        nomeHeroi: document.getElementById("nomeHeroi"),
        vidaHeroiTexto: document.getElementById("vidaHeroiTexto"),
        vidaHeroiBarra: document.getElementById("vidaHeroiBarra"),
        imagemHeroi: document.getElementById("imagemHeroi"),

        nomeVilao: document.getElementById("nomeVilao"),
        vidaVilaoTexto: document.getElementById("vidaVilaoTexto"),
        vidaVilaoBarra: document.getElementById("vidaVilaoBarra"),
        imagemVilao: document.getElementById("imagemVilao"),

        registroBatalha: document.getElementById("registroBatalha"),
        quantidadePocao: document.getElementById("quantidadePocao"),

        btnAtacar: document.getElementById("btnAtacar"),
        btnCurar: document.getElementById("btnCurar"),
        btnProxima: document.getElementById("btnProxima"),
        btnReiniciar: document.getElementById("btnReiniciar"),

        resultadoBatalha: document.getElementById("resultadoBatalha"),
        tituloResultado: document.getElementById("tituloResultado"),
        textoResultado: document.getElementById("textoResultado"),

        efeitosCombate: document.getElementById("efeitosCombate")
    };

    // ==========================================
    // VERIFICAR SISTEMAS
    // ==========================================

    if (!window.CatalogoJogo || !window.Jogo) {
        console.error(
            "Erro: personagens.js e estado.js precisam ser carregados antes de ArenaI.js."
        );

        elementos.registroBatalha.textContent =
            "Erro ao carregar os sistemas do jogo.";

        return;
    }

    // ==========================================
    // NOME DO JOGADOR
    // ==========================================

    function obterNomeJogador() {
        const chaves = [
            "nomeJogador",
            "apelidoJogador",
            "nomeUsuario",
            "jogadorNome"
        ];

        for (const chave of chaves) {
            const valor = localStorage.getItem(chave);

            if (valor && valor.trim()) {
                return valor.trim();
            }
        }

        return "Aventureiro";
    }

    elementos.nomeUsuario.textContent = obterNomeJogador();

    // ==========================================
    // CARREGAR PERSONAGENS
    // ==========================================

    const heroi = window.CatalogoJogo.obterHeroi();
    const vilao = window.CatalogoJogo.sortearVilao();

    if (!heroi || !vilao) {
        elementos.registroBatalha.textContent =
            "Não foi possível carregar os personagens da batalha.";

        console.error("Herói ou vilão não encontrado.");
        return;
    }

    // ==========================================
    // ATRIBUTOS E EQUIPAMENTOS
    // ==========================================

    const bonus = window.Jogo.getBonus();

    const ataqueHeroi =
        Number(heroi.ataque || 0) + Number(bonus.ataque || 0);

    const defesaHeroi =
        Number(heroi.defesa || 0) + Number(bonus.defesa || 0);

    elementos.valorAtaque.textContent = ataqueHeroi;

    // ==========================================
    // VIDA DOS PERSONAGENS
    // ==========================================

    const vidaMaximaHeroi = Number(heroi.vida);
    const vidaMaximaVilao = Number(vilao.vida);

    let vidaHeroi = vidaMaximaHeroi;
    let vidaVilao = vidaMaximaVilao;

    let batalhaFinalizada = false;
    let turnoEmAndamento = false;

    let vitoriaRegistrada =
        localStorage.getItem(CHAVE_VITORIA) === "true";

    // ==========================================
    // IMAGENS E NOMES
    // ==========================================

    elementos.nomeHeroi.textContent = heroi.nome;
    elementos.nomeVilao.textContent = vilao.nome;

    elementos.imagemHeroi.src = heroi.imagem;
    elementos.imagemVilao.src = vilao.imagem;

    elementos.imagemHeroi.onerror = () => {
        console.error("Imagem do herói não encontrada:", heroi.imagem);
        elementos.imagemHeroi.style.visibility = "hidden";
    };

    elementos.imagemVilao.onerror = () => {
        console.error("Imagem do vilão não encontrada:", vilao.imagem);
        elementos.imagemVilao.style.visibility = "hidden";
    };

    // ==========================================
    // MOEDAS
    // ==========================================

    function atualizarMoedas() {
        elementos.moedas.textContent =
            window.Jogo.getMoedas().toLocaleString("pt-BR");
    }

    // ==========================================
    // POÇÕES
    // ==========================================

    function obterQuantidadePocoes() {
        return window.Jogo.getQuantidade("pocao_cura");
    }

    function atualizarPocoes() {
        const quantidade = obterQuantidadePocoes();

        elementos.quantidadePocao.textContent = quantidade;

        elementos.btnCurar.disabled =
            batalhaFinalizada ||
            turnoEmAndamento ||
            quantidade <= 0 ||
            vidaHeroi <= 0;
    }

    // ==========================================
    // ATUALIZAR BARRAS DE VIDA
    // ==========================================

    function atualizarVida() {
        elementos.vidaHeroiTexto.textContent =
            `${vidaHeroi}/${vidaMaximaHeroi}`;

        elementos.vidaVilaoTexto.textContent =
            `${vidaVilao}/${vidaMaximaVilao}`;

        const porcentagemHeroi =
            (vidaHeroi / vidaMaximaHeroi) * 100;

        const porcentagemVilao =
            (vidaVilao / vidaMaximaVilao) * 100;

        elementos.vidaHeroiBarra.style.width =
            `${Math.max(0, porcentagemHeroi)}%`;

        elementos.vidaVilaoBarra.style.width =
            `${Math.max(0, porcentagemVilao)}%`;

        atualizarPocoes();
    }

    // ==========================================
    // MENSAGENS
    // ==========================================

    function registrarMensagem(mensagem) {
        elementos.registroBatalha.textContent = mensagem;
    }

    // ==========================================
    // NÚMEROS FLUTUANTES
    // ==========================================

    function mostrarNumero(elemento, valor, tipo = "dano") {
        const numero = document.createElement("div");

        numero.className =
            tipo === "cura"
                ? "numero-dano numero-cura"
                : "numero-dano";

        numero.textContent =
            tipo === "cura" ? `+${valor}` : `-${valor}`;

        const posicao = elemento.getBoundingClientRect();

        numero.style.left =
            `${posicao.left + posicao.width / 2}px`;

        numero.style.top =
            `${posicao.top + posicao.height / 2}px`;

        elementos.efeitosCombate.appendChild(numero);

        setTimeout(() => numero.remove(), 1100);
    }

    // ==========================================
    // ANIMAÇÕES
    // ==========================================

    function animar(elemento, classe) {
        elemento.classList.remove(classe);

        void elemento.offsetWidth;

        elemento.classList.add(classe);

        elemento.addEventListener(
            "animationend",
            () => elemento.classList.remove(classe),
            { once: true }
        );
    }

    // ==========================================
    // CONTROLES
    // ==========================================

    function bloquearControles() {
        elementos.btnAtacar.disabled = true;
        elementos.btnCurar.disabled = true;
    }

    function atualizarControles() {
        elementos.btnAtacar.disabled =
            batalhaFinalizada || turnoEmAndamento;

        atualizarPocoes();
    }

    // ==========================================
    // RESULTADO
    // ==========================================

    function mostrarResultado(titulo, mensagem) {
        elementos.resultadoBatalha.hidden = false;

        elementos.tituloResultado.textContent = titulo;
        elementos.textoResultado.textContent = mensagem;
    }

    function esconderResultado() {
        elementos.resultadoBatalha.hidden = true;
    }

    // ==========================================
    // VITÓRIA
    // ==========================================

    function vencerBatalha() {
        if (batalhaFinalizada) return;

        batalhaFinalizada = true;
        turnoEmAndamento = false;

        bloquearControles();

        animar(elementos.imagemVilao, "derrotado");

        // Entregar a recompensa somente uma vez.
        if (!vitoriaRegistrada) {
            const resultado =
                window.Jogo.adicionarMoedas(RECOMPENSA_VITORIA);

            if (resultado && resultado.ok === false) {
                registrarMensagem(
                    "Você venceu, mas ocorreu um erro ao entregar a recompensa."
                );

                return;
            }

            vitoriaRegistrada = true;

            localStorage.setItem(CHAVE_VITORIA, "true");
        }

        atualizarMoedas();

        // O botão agora leva para a tela de créditos.
        elementos.btnProxima.hidden = false;
        elementos.btnReiniciar.hidden = true;

        mostrarResultado(
            "VITÓRIA!",
            `Você derrotou ${vilao.nome} e conquistou ${RECOMPENSA_VITORIA} moedas! Continue sua jornada.`
        );

        registrarMensagem(
            `Vitória! Você recebeu ${RECOMPENSA_VITORIA} moedas!`
        );
    }

    // ==========================================
    // DERROTA
    // ==========================================

    function perderBatalha() {
        if (batalhaFinalizada) return;

        batalhaFinalizada = true;
        turnoEmAndamento = false;

        bloquearControles();

        animar(elementos.imagemHeroi, "derrotado");

        elementos.btnReiniciar.hidden = false;
        elementos.btnProxima.hidden = true;

        mostrarResultado(
            "DERROTA!",
            "Você foi derrotado! Reinicie a batalha para tentar novamente. O mesmo vilão estará esperando."
        );

        registrarMensagem(
            "Você foi derrotado! Tente novamente."
        );
    }

    // ==========================================
    // ATAQUE DO HERÓI
    // ==========================================

    function atacar() {
        if (batalhaFinalizada || turnoEmAndamento) return;

        turnoEmAndamento = true;
        atualizarControles();

        const dano = Math.max(
            1,
            ataqueHeroi - Number(vilao.defesa || 0)
        );

        vidaVilao = Math.max(0, vidaVilao - dano);

        animar(elementos.imagemHeroi, "atacando");
        animar(elementos.imagemVilao, "recebendo-dano");

        mostrarNumero(elementos.imagemVilao, dano);

        atualizarVida();

        registrarMensagem(
            `${heroi.nome} atacou ${vilao.nome}, causando ${dano} de dano!`
        );

        if (vidaVilao <= 0) {
            vencerBatalha();
            return;
        }

        setTimeout(atacarVilao, 650);
    }

    // ==========================================
    // CONTRA-ATAQUE DO VILÃO
    // ==========================================

    function atacarVilao() {
        if (batalhaFinalizada) return;

        const dano = Math.max(
            1,
            Number(vilao.ataque || 0) - defesaHeroi
        );

        vidaHeroi = Math.max(0, vidaHeroi - dano);

        animar(elementos.imagemVilao, "atacando-vilao");
        animar(elementos.imagemHeroi, "recebendo-dano");

        mostrarNumero(elementos.imagemHeroi, dano);

        atualizarVida();

        registrarMensagem(
            `${vilao.nome} contra-atacou e causou ${dano} de dano!`
        );

        if (vidaHeroi <= 0) {
            perderBatalha();
            return;
        }

        turnoEmAndamento = false;
        atualizarControles();
    }

    // ==========================================
    // POÇÃO DE CURA
    // ==========================================

    function curar() {
        if (batalhaFinalizada || turnoEmAndamento) return;

        const item = window.Jogo.getItem("pocao_cura");

        if (!item || obterQuantidadePocoes() <= 0) {
            registrarMensagem("Você não possui poções de cura!");
            atualizarPocoes();
            return;
        }

        if (vidaHeroi >= vidaMaximaHeroi) {
            registrarMensagem("Sua vida já está completa!");
            return;
        }

        turnoEmAndamento = true;
        atualizarControles();

        const resultado = window.Jogo.usarItem("pocao_cura");

        if (!resultado.ok) {
            turnoEmAndamento = false;

            registrarMensagem(
                resultado.motivo || "Não foi possível usar a poção."
            );

            atualizarControles();
            return;
        }

        const cura = Number(item.recupera || 50);

        const vidaAnterior = vidaHeroi;

        vidaHeroi = Math.min(
            vidaMaximaHeroi,
            vidaHeroi + cura
        );

        const vidaRecuperada = vidaHeroi - vidaAnterior;

        mostrarNumero(
            elementos.imagemHeroi,
            vidaRecuperada,
            "cura"
        );

        atualizarVida();

        registrarMensagem(
            `${heroi.nome} utilizou uma poção e recuperou ${vidaRecuperada} pontos de vida!`
        );

        setTimeout(atacarVilao, 650);
    }

    // ==========================================
    // REINICIAR BATALHA
    // ==========================================

    function reiniciarBatalha() {
        if (vitoriaRegistrada) return;

        vidaHeroi = vidaMaximaHeroi;
        vidaVilao = vidaMaximaVilao;

        batalhaFinalizada = false;
        turnoEmAndamento = false;

        esconderResultado();

        elementos.imagemHeroi.classList.remove(
            "derrotado",
            "recebendo-dano",
            "atacando"
        );

        elementos.imagemVilao.classList.remove(
            "derrotado",
            "recebendo-dano",
            "atacando-vilao"
        );

        elementos.btnProxima.hidden = true;
        elementos.btnReiniciar.hidden = true;

        atualizarVida();
        atualizarControles();

        registrarMensagem(
            "A batalha recomeçou! Você e o mesmo vilão estão com a vida completa."
        );
    }

    // ==========================================
    // CONTINUAR HISTÓRIA
    // ==========================================

    function continuarHistoria() {
        if (!vitoriaRegistrada || !batalhaFinalizada) return;

        window.location.href = PAGINA_CREDITOS;
    }

    // ==========================================
    // EVENTOS DOS BOTÕES
    // ==========================================

    elementos.btnAtacar.addEventListener("click", atacar);

    elementos.btnCurar.addEventListener("click", curar);

    elementos.btnReiniciar.addEventListener(
        "click",
        reiniciarBatalha
    );

    elementos.btnProxima.addEventListener(
        "click",
        continuarHistoria
    );

    // ==========================================
    // ATUALIZAÇÃO DO ESTADO
    // ==========================================

    window.addEventListener("estado-mudou", () => {
        atualizarMoedas();
        atualizarPocoes();
    });

    window.addEventListener("storage", (evento) => {
        if (evento.key === "rpg_estado_v1") {
            atualizarMoedas();
            atualizarPocoes();
        }
    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    atualizarMoedas();
    atualizarVida();

    elementos.btnProxima.hidden = true;
    elementos.btnReiniciar.hidden = true;

    registrarMensagem(
        `${heroi.nome} está diante de ${vilao.nome}. A batalha vai começar!`
    );

    // ==========================================
    // VERIFICAR VITÓRIA ANTERIOR
    // ==========================================

    if (vitoriaRegistrada) {
        batalhaFinalizada = true;

        bloquearControles();

        vidaVilao = 0;

        atualizarVida();

        animar(elementos.imagemVilao, "derrotado");

        elementos.btnProxima.hidden = false;

        mostrarResultado(
            "ARENA CONCLUÍDA!",
            "Você já venceu esta arena e recebeu sua recompensa. Continue a história!"
        );

        registrarMensagem("Arena I concluída!");
    }

});
