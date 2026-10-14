const BANK_KEY = "lastKingdomBancoV1";
const STARTING_GOLD = 200;
const ENTRY_REWARD = 50;

const items = [
    {
        id: "pocao",
        name: "Poção de Vida",
        icon: "🧪",
        rarity: "COMUM",
        desc: "Recupera as forças e aumenta a vida máxima do herói.",
        price: 30,
        bonus: { attack: 0, defense: 0, health: 20 }
    },
    {
        id: "espada",
        name: "Espada de Ferro",
        icon: "⚔️",
        rarity: "RARO",
        desc: "Uma lâmina resistente que aumenta o ataque.",
        price: 80,
        bonus: { attack: 5, defense: 0, health: 0 }
    },
    {
        id: "escudo",
        name: "Escudo Real",
        icon: "🛡️",
        rarity: "RARO",
        desc: "Um escudo nobre que fortalece a defesa.",
        price: 65,
        bonus: { attack: 0, defense: 5, health: 0 }
    },
    {
        id: "armadura",
        name: "Armadura de Prata",
        icon: "🏰",
        rarity: "ÉPICO",
        desc: "Uma armadura que aumenta a defesa e a vida.",
        price: 120,
        bonus: { attack: 0, defense: 8, health: 15 }
    },
    {
        id: "chave",
        name: "Chave Antiga",
        icon: "🗝️",
        rarity: "INCOMUM",
        desc: "Uma relíquia antiga que fortalece o herói.",
        price: 45,
        bonus: { attack: 2, defense: 2, health: 5 }
    },
    {
        id: "cristal",
        name: "Cristal Mágico",
        icon: "💎",
        rarity: "LENDÁRIO",
        desc: "Um cristal mágico que aumenta todos os atributos.",
        price: 100,
        bonus: { attack: 5, defense: 5, health: 25 }
    }
];

function newBank() {
    return { locked: 0, history: [], purchases: 0 };
}

function loadBank() {
    try {
        const data = JSON.parse(localStorage.getItem(BANK_KEY));

        if (
            data &&
            Number.isSafeInteger(data.locked) &&
            data.locked >= 0 &&
            Array.isArray(data.history)
        ) {
            return {
                locked: data.locked,
                history: data.history
                    .filter(entry =>
                        entry &&
                        typeof entry.operation === "string" &&
                        Number.isSafeInteger(entry.amount) &&
                        typeof entry.detail === "string"
                    )
                    .slice(-100),
                purchases:
                    Number.isSafeInteger(data.purchases) && data.purchases >= 0
                        ? data.purchases
                        : 0
            };
        }
    } catch (error) {
        console.warn("Não foi possível ler os dados do banco.", error);
    }

    return newBank();
}

let bank = loadBank();
let gold = STARTING_GOLD + ENTRY_REWARD;
let spentThisSession = 0;

/* ATRIBUTOS INICIAIS DO HERÓI */
const hero = {
    attack: 10,
    defense: 10,
    health: 100
};

const goldEl = document.getElementById("gold");
const lockedEl = document.getElementById("locked");
const spentEl = document.getElementById("spent");
const countEl = document.getElementById("item-count");
const marketEl = document.getElementById("market");
const historyEl = document.getElementById("history");
const emptyHistory = document.getElementById("empty-history");
const messageEl = document.getElementById("message");
const amountEl = document.getElementById("amount");
const bankSection = document.getElementById("royal-bank");
const bankToggle = document.getElementById("bank-toggle");

function saveBank() {
    try {
        localStorage.setItem(BANK_KEY, JSON.stringify(bank));
        return true;
    } catch (error) {
        console.warn("Não foi possível salvar o banco.", error);
        showMessage("Não foi possível salvar as alterações no banco.");
        return false;
    }
}

function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.add("show");
}

function toggleBank(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean"
        ? forceOpen
        : bankSection.hidden;

    bankSection.hidden = !shouldOpen;
    bankToggle.setAttribute("aria-expanded", String(shouldOpen));
    bankToggle.textContent = shouldOpen ? "✕ FECHAR BANCO" : "♛ VER BANCO";

    if (shouldOpen) {
        bankSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

bankToggle.addEventListener("click", () => toggleBank());

document.getElementById("bank-close").addEventListener("click", () => {
    toggleBank(false);
    bankToggle.focus();
});

document.getElementById("market-nav").addEventListener("click", () => {
    document.getElementById("market-heading").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

function record(operation, amount, detail) {
    bank.history.push({
        operation,
        amount,
        detail,
        date: new Date().toLocaleString("pt-BR")
    });

    bank.history = bank.history.slice(-100);
}

/* ATUALIZA O PAINEL DO HERÓI */
function updateHero() {
    document.getElementById("hero-attack").textContent = hero.attack;
    document.getElementById("hero-defense").textContent = hero.defense;
    document.getElementById("hero-health").textContent = hero.health;
}

function update() {
    goldEl.textContent = gold;
    lockedEl.textContent = bank.locked;
    spentEl.textContent = spentThisSession;
    countEl.textContent = bank.purchases;

    marketEl.querySelectorAll("[data-id]").forEach(button => {
        const item = items.find(x => x.id === button.dataset.id);
        if (!item) return;

        button.disabled = gold < item.price;
        button.textContent = gold < item.price
            ? "OURO INSUFICIENTE"
            : "⚜ ADQUIRIR ITEM";
    });

    historyEl.replaceChildren();
    emptyHistory.style.display = bank.history.length ? "none" : "block";

    [...bank.history].reverse().forEach(entry => {
        const tr = document.createElement("tr");

        [
            entry.operation,
            `${entry.amount} 🪙`,
            entry.detail,
            entry.date || "—"
        ].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        historyEl.appendChild(tr);
    });

    updateHero();
}

function createMarket() {
    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "item";

        const art = document.createElement("div");
        art.className = "art";
        art.textContent = item.icon;
        art.setAttribute("aria-hidden", "true");

        const rarity = document.createElement("div");
        rarity.className = "rarity";
        rarity.textContent = `✦ ${item.rarity} ✦`;

        const title = document.createElement("h3");
        title.textContent = item.name;

        const desc = document.createElement("p");
        desc.className = "description";
        desc.textContent = item.desc;

        const bonus = document.createElement("p");
        bonus.className = "bank-tip";
        const bonusText = [];

        if (item.bonus.attack > 0) {
            bonusText.push(`+${item.bonus.attack} Ataque`);
        }
        if (item.bonus.defense > 0) {
            bonusText.push(`+${item.bonus.defense} Defesa`);
        }
        if (item.bonus.health > 0) {
            bonusText.push(`+${item.bonus.health} Vida`);
        }

        bonus.textContent = `✦ Bônus: ${bonusText.join(" · ")}`;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `🪙 ${item.price} moedas de ouro`;

        const button = document.createElement("button");
        button.className = "gold-button buy";
        button.type = "button";
        button.dataset.id = item.id;
        button.addEventListener("click", () => buy(item));

        card.append(art, rarity, title, desc, bonus, price, button);
        marketEl.appendChild(card);
    });
}

/*
  COMPRA:
  1. Validar se o saldo é suficiente.
  2. Confirmar a compra e descontar o preço.
  3. Aplicar imediatamente os bônus ao herói.
  4. Atualizar os painéis.
*/
function buy(item) {
    /* VALIDAÇÃO DE SALDO ANTES DA COMPRA */
    if (!Number.isSafeInteger(item.price) || item.price <= 0) {
        showMessage("Esta compra possui um preço inválido.");
        return;
    }

    if (gold < item.price) {
        showMessage(
            `Compra recusada! Você tem ${gold} moedas, mas precisa de ${item.price} moedas para comprar ${item.name}.`
        );
        return;
    }

    /* GUARDAR OS VALORES ANTERIORES PARA PODER REVERTER */
    const previousGold = gold;
    const previousSpent = spentThisSession;
    const previousPurchases = bank.purchases;
    const previousHistoryLength = bank.history.length;

    /* CONFIRMAR A COMPRA E DESCONTAR O OURO */
    gold -= item.price;
    spentThisSession += item.price;
    bank.purchases += 1;

    /* APLICAR OS AUMENTOS DE ATRIBUTOS IMEDIATAMENTE */
    hero.attack += item.bonus.attack;
    hero.defense += item.bonus.defense;
    hero.health += item.bonus.health;

    record("Compra", item.price, item.name);

    /* SALVAR E REVERTER SE A OPERAÇÃO FALHAR */
    if (!saveBank()) {
        gold = previousGold;
        spentThisSession = previousSpent;
        bank.purchases = previousPurchases;
        bank.history.length = previousHistoryLength;

        hero.attack -= item.bonus.attack;
        hero.defense -= item.bonus.defense;
        hero.health -= item.bonus.health;

        update();
        return;
    }

    /* ATUALIZAR SALDO, BOTÕES E ATRIBUTOS NA TELA */
    update();

    const bonuses = [];

    if (item.bonus.attack > 0) {
        bonuses.push(`Ataque +${item.bonus.attack}`);
    }
    if (item.bonus.defense > 0) {
        bonuses.push(`Defesa +${item.bonus.defense}`);
    }
    if (item.bonus.health > 0) {
        bonuses.push(`Vida +${item.bonus.health}`);
    }

    showMessage(
        `✦ Compra confirmada: ${item.name}! Seu ouro foi descontado e os atributos foram atualizados: ${bonuses.join(", ")}.`
    );
}

document.getElementById("deposit").addEventListener("click", () => {
    const amount = Number(amountEl.value);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
        showMessage("Informe uma quantidade inteira e válida de moedas.");
        return;
    }

    if (amount > gold) {
        showMessage("O ouro disponível não é suficiente para esse depósito.");
        return;
    }

    const previousLocked = bank.locked;
    const previousGold = gold;
    const previousHistoryLength = bank.history.length;

    gold -= amount;
    bank.locked += amount;
    record("Depósito", amount, "Ouro guardado no Banco Real");

    if (!saveBank()) {
        gold = previousGold;
        bank.locked = previousLocked;
        bank.history.length = previousHistoryLength;
        update();
        return;
    }

    amountEl.value = "";
    update();
    showMessage(`♛ ${amount} moedas foram guardadas no tesouro real.`);
});

document.getElementById("withdraw").addEventListener("click", () => {
    const amount = Number(amountEl.value);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
        showMessage("Informe a quantidade de ouro que deseja desbloquear.");
        return;
    }

    if (amount > bank.locked) {
        showMessage("O tesouro não possui essa quantidade de ouro guardado.");
        return;
    }

    const previousLocked = bank.locked;
    const previousGold = gold;
    const previousHistoryLength = bank.history.length;

    bank.locked -= amount;
    gold += amount;
    record("Saque", amount, "Ouro liberado para a partida");

    if (!saveBank()) {
        bank.locked = previousLocked;
        gold = previousGold;
        bank.history.length = previousHistoryLength;
        update();
        return;
    }

    amountEl.value = "";
    update();
    showMessage(`♛ ${amount} moedas foram liberadas para suas negociações.`);
});

createMarket();
update();