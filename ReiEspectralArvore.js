const CUSTO = 1000;

const STORAGE_KEY = "reiEspectralSave_v1";

let xp = 0;

let levels = {
    core: 0,
    power: 0,
    armor: 0,
    essence: 0
};

let selected = "core";


const skills = {

    core: {
        name: "Coração Espectral",
        desc: "A essência do Rei Espectral. O núcleo que conecta todos os seus poderes."
    },

    power: {
        name: "Poder Espectral",
        desc: "Libera chamas verdes sobrenaturais, aumentando o ataque do Rei Espectral em 10% por nível.",
        attribute: "ATAQUE"
    },

    armor: {
        name: "Armadura das Trevas",
        desc: "Fortalece a armadura amaldiçoada, aumentando a defesa do Rei Espectral em 10% por nível.",
        attribute: "DEFESA"
    },

    essence: {
        name: "Essência Amaldiçoada",
        desc: "Fortalece a energia vital do Rei Espectral, aumentando sua vida máxima em 10% por nível.",
        attribute: "VIDA"
    }

};


// CARREGAR PROGRESSO

function loadGame() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        const data = JSON.parse(saved);

        if (!data || typeof data !== "object") return;

        if (Number.isSafeInteger(data.xp) && data.xp >= 0) {
            xp = data.xp;
        }

        if (data.levels && typeof data.levels === "object") {

            ["power", "armor", "essence"].forEach(id => {

                const value = data.levels[id];

                if (
                    Number.isInteger(value) &&
                    value >= 0 &&
                    value <= 3
                ) {
                    levels[id] = value;
                }

            });

        }

        if (
            typeof data.selected === "string" &&
            Object.prototype.hasOwnProperty.call(skills, data.selected)
        ) {
            selected = data.selected;
        }

    } catch (error) {

        console.error("Erro ao carregar:", error);

    }

}


// SALVAR PROGRESSO

function saveGame() {

    try {

        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            xp: xp,
            levels: levels,
            selected: selected
        }));

    } catch (error) {

        console.error("Erro ao salvar:", error);

    }

}


// ATUALIZAR INTERFACE

function render() {

    document.getElementById("xp").textContent =
        xp.toLocaleString("pt-BR") + " XP";

    document.getElementById("progress").style.width =
        (xp % CUSTO) / CUSTO * 100 + "%";


    // ATUALIZAR NÓS

    document.querySelectorAll(".node").forEach(node => {

        const id = node.dataset.id;
        const level = levels[id];

        node.querySelector(".rank").textContent =
            id === "core" ? "REI" : level + "/3";

        node.classList.toggle(
            "available",
            id !== "core" && level < 3
        );

        node.classList.toggle(
            "maxed",
            id !== "core" && level === 3
        );

    });


    const skill = skills[selected];
    const level = levels[selected];


    // NOME E DESCRIÇÃO

    document.getElementById("skill-name").textContent =
        skill.name;

    document.getElementById("skill-desc").textContent =
        skill.desc;


    const bonusElement =
        document.getElementById("skill-bonus");

    const costElement =
        document.getElementById("skill-cost");


    // MOSTRAR BÔNUS E CUSTO

    if (selected !== "core") {

        const currentBonus = level * 10;
        const nextBonus = Math.min(level + 1, 3) * 10;

        bonusElement.textContent =
            "Bônus atual: +" + currentBonus +
            "% de " + skill.attribute;

        if (level < 3) {

            costElement.textContent =
                "Próxima melhoria: +" + (nextBonus - currentBonus) +
                "% de " + skill.attribute +
                " | Custo: 1.000 XP";

        } else {

            costElement.textContent =
                "Habilidade no nível máximo!";

        }

    } else {

        bonusElement.textContent = "";

        costElement.textContent =
            "Selecione uma habilidade para ver seu custo de melhoria.";

    }


    // BOTÃO DE MELHORIA

    const button = document.getElementById("upgrade");

    const canUpgrade =
        selected !== "core" &&
        level < 3 &&
        xp >= CUSTO;

    button.disabled = !canUpgrade;


    if (selected === "core") {

        button.textContent = "Coração Espectral";

    } else if (level === 3) {

        button.textContent = "Nível máximo";

    } else if (xp < CUSTO) {

        button.textContent =
            "Necessário: 1.000 XP";

    } else {

        button.textContent =
            "Aprimorar habilidade";

    }

}


// SELECIONAR HABILIDADE

document.querySelectorAll(".node").forEach(node => {

    node.addEventListener("click", () => {

        selected = node.dataset.id;

        saveGame();

        render();

    });

});


// COMPRAR MELHORIA

document.getElementById("upgrade").addEventListener("click", () => {

    if (
        selected !== "core" &&
        levels[selected] < 3 &&
        xp >= CUSTO
    ) {

        xp -= CUSTO;

        levels[selected]++;

        saveGame();

        render();

    }

});


// RECEBER XP

window.addGameXP = function(amount) {

    const value = Number(amount);

    if (Number.isFinite(value) && value > 0) {

        xp += Math.floor(value);

        saveGame();

        render();

    }

};


// CONSULTAR BÔNUS

window.getEspectralBonuses = function() {

    return {

        attack: levels.power * 10,

        defense: levels.armor * 10,

        health: levels.essence * 10

    };

};


// CONSULTAR XP

window.getEspectralXP = function() {

    return xp;

};


// CONSULTAR NÍVEIS

window.getEspectralLevels = function() {

    return { ...levels };

};


// VOLTAR

function voltar() {

    saveGame();

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href = "index.html";

    }

}


// INICIALIZAR

loadGame();

render();