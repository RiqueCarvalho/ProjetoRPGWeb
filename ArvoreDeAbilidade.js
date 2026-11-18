const CUSTO = 1000;

let xp = 0;

let levels = {
    core: 0,
    brutal: 0,
    iron: 0,
    axe: 0,
    intimidate: 0,
    fury: 0,
    blood: 0,
    stamina: 0,
    berserk: 0,
    warcry: 0,
    legend: 0
};

let selected = "core";

const skills = {

    core: {
        name: "Essência de Ragnar",
        desc: "O coração do guerreiro. O poder central que conecta todos os atributos.",
        requires: []
    },

    brutal: {
        name: "Força Brutal",
        desc: "A força colossal de Ragnar. Aumenta o poder dos golpes e a força física.",
        requires: []
    },

    iron: {
        name: "Resistência de Ferro",
        desc: "A capacidade de continuar lutando mesmo diante dos maiores desafios.",
        requires: []
    },

    axe: {
        name: "Mestre do Machado",
        desc: "Domínio do machado colossal. Melhora a técnica e a potência dos ataques.",
        requires: ["brutal"]
    },

    intimidate: {
        name: "Presença Aterradora",
        desc: "A presença intimidadora de Ragnar, capaz de impor respeito.",
        requires: ["iron"]
    },

    fury: {
        name: "Fúria do Carniceiro",
        desc: "Transforma a determinação de Ragnar em explosões de força.",
        requires: []
    },

    blood: {
        name: "Instinto de Sobrevivência",
        desc: "Melhora a resistência e a recuperação entre confrontos.",
        requires: ["brutal"]
    },

    stamina: {
        name: "Vigor Nórdico",
        desc: "Aumenta a energia e o fôlego para batalhas longas.",
        requires: ["iron"]
    },

    berserk: {
        name: "Fúria Berserker",
        desc: "Aprimora a Fúria do Carniceiro e seus bônus de combate.",
        requires: ["fury", "brutal"]
    },

    warcry: {
        name: "Grito de Guerra",
        desc: "A força de vontade de Ragnar inspira temor e determinação.",
        requires: ["intimidate", "blood"]
    },

    legend: {
        name: "Lenda do Carniceiro",
        desc: "O auge do caminho de Ragnar: reúne força, resistência e domínio.",
        requires: ["berserk", "warcry"]
    }

};

// VERIFICA SE A HABILIDADE ESTÁ DESBLOQUEADA

function unlocked(id) {

    return id === "core" ||
        skills[id].requires.every(
            requirement => levels[requirement] >= 1
        );

}

// ATUALIZA A INTERFACE

function render() {

    document.getElementById("xp").textContent =
        xp.toLocaleString("pt-BR") + " XP";

    document.getElementById("progress").style.width =
        (xp % CUSTO) / CUSTO * 100 + "%";

    document.querySelectorAll(".node").forEach(node => {

        const id = node.dataset.id;
        const level = levels[id];

        node.querySelector(".rank").textContent =
            id === "core" ? "RAGNAR" : level + "/3";

        node.classList.toggle(
            "locked",
            !unlocked(id)
        );

        node.classList.toggle(
            "available",
            unlocked(id) && level < 3
        );

        node.classList.toggle(
            "maxed",
            level === 3
        );

    });

    const skill = skills[selected];
    const level = levels[selected];

    document.getElementById("skill-name").textContent =
        skill.name;

    document.getElementById("skill-desc").textContent =
        skill.desc +
        (selected !== "core"
            ? " Nível atual: " + level + "/3."
            : "");

    const canUpgrade =
        selected !== "core" &&
        unlocked(selected) &&
        level < 3 &&
        xp >= CUSTO;

    const button = document.getElementById("upgrade");

    button.disabled = !canUpgrade;

    if (level === 3) {

        button.textContent = "Nível máximo";

    } else if (!unlocked(selected)) {

        button.textContent = "Habilidade bloqueada";

    } else if (xp < CUSTO) {

        button.textContent = "Necessário: 1.000 XP";

    } else {

        button.textContent = "Aprimorar habilidade";

    }

}

// SELECIONAR HABILIDADES

document.querySelectorAll(".node").forEach(node => {

    node.addEventListener("click", () => {

        selected = node.dataset.id;

        render();

        if (!unlocked(selected)) {

            document.getElementById("skill-desc").textContent =
                "Esta habilidade está bloqueada. Aprimore primeiro os atributos necessários.";

        }

    });

});

// APRIMORAR HABILIDADES

document.getElementById("upgrade").addEventListener("click", () => {

    if (
        selected !== "core" &&
        unlocked(selected) &&
        levels[selected] < 3 &&
        xp >= CUSTO
    ) {

        xp -= CUSTO;

        levels[selected]++;

        render();

    }

});

// RECEBER XP DO SISTEMA DO JOGO

window.addGameXP = function(amount) {

    const value = Number(amount);

    if (Number.isFinite(value) && value > 0) {

        xp += Math.floor(value);

        render();

    }

};

// BOTÃO VOLTAR

function voltar() {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href = "index.html";

    }

}

// INICIALIZAÇÃO

render();