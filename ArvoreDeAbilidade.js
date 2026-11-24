const CUSTO = 1000;

let xp = 0;

let levels = {

    core: 0,
    iron: 0,
    fury: 0,
    blood: 0

};

let selected = "core";


const skills = {

    core: {

        name: "Essência de Ragnar",

        desc: "O coração do guerreiro. O poder central que conecta todos os atributos."

    },

    iron: {

        name: "Resistência de Ferro",

        desc: "Fortalece o corpo de Ragnar, aumentando sua defesa em 10% por nível."

    },

    fury: {

        name: "Fúria do Carniceiro",

        desc: "Desperta a fúria de Ragnar, aumentando seu ataque em 10% por nível."

    },

    blood: {

        name: "Instinto de Sobrevivência",

        desc: "Aprimora a capacidade de sobrevivência de Ragnar, aumentando sua vida em 10% por nível."

    }

};


// VERIFICA SE A HABILIDADE ESTÁ DESBLOQUEADA

function unlocked(id) {

    return true;

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


        node.classList.remove("locked");


        node.classList.toggle(
            "available",
            level < 3 && id !== "core"
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
        (
            selected !== "core"
                ? " Nível atual: " + level + "/3."
                : ""
        );


    const button = document.getElementById("upgrade");


    const canUpgrade =
        selected !== "core" &&
        level < 3 &&
        xp >= CUSTO;


    button.disabled = !canUpgrade;


    if (selected === "core") {

        button.textContent = "Habilidade central";

    } else if (level === 3) {

        button.textContent = "Nível máximo";

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

    });

});


// APRIMORAR HABILIDADES

document.getElementById("upgrade").addEventListener("click", () => {

    if (

        selected !== "core" &&

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


// CONSULTAR OS BÔNUS DAS HABILIDADES

window.getRagnarBonuses = function() {

    return {

        attack: levels.fury * 10,

        defense: levels.iron * 10,

        health: levels.blood * 10

    };

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