/* ===== Configuração ===== */
const PLAYER_NAME = "User";
const MAX_HP = 120, POTION_HEAL = 50, POTION_PRICE = 20, START_POTIONS = 1;
const BASE_ATK = 15;
// Arsenal vazio. Para adicionar armas: { name:"Nome", atk:22, price:60, icon:"🪓" }
const WEAPONS = [];

let S;
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);
const wait = ms => new Promise(r => setTimeout(r, ms));

function newEnemy(arena) {
    const hp = 120 + (arena - 1) * 30;
    return { hp, max: hp, atk: 8 + arena * 3, reward: 20 + arena * 8, name: "Bárbaro Nv. " + arena };
}
function newGame() {
    S = { hp: MAX_HP, coins: 0, potions: START_POTIONS, arena: 1, weapon: -1, owned: WEAPONS.map(() => false), enemy: newEnemy(1), busy: false, over: false };
    $("pl").classList.remove("dead"); $("en").classList.remove("dead");
    $("ovEnd").classList.remove("on"); $("ovWeap").classList.remove("on");
    say(""); render();
}
function say(t) { $("msg").textContent = t; }
const atkValue = () => (WEAPONS[S.weapon] ? WEAPONS[S.weapon].atk : BASE_ATK);

function render() {
    $("atk").textContent = "Ataque: " + atkValue();
    $("coins").textContent = S.coins + " Moedas";
    $("name").textContent = PLAYER_NAME;
    setBar("hpPl", S.hp, MAX_HP);
    setBar("hpEn", S.enemy.hp, S.enemy.max);
    const dead = S.enemy.hp <= 0;
    $("bAtk").disabled = S.busy || dead || S.over;
    const canPot = S.potions > 0 || S.coins >= POTION_PRICE;
    $("potBadge").textContent = S.potions > 0 ? "×" + S.potions : POTION_PRICE + " moedas";
    $("bPot").disabled = S.busy || dead || S.over || !canPot || S.hp >= MAX_HP;
    $("bNext").disabled = S.busy || !dead || S.over;
    $("bWeap").disabled = S.busy;
}
function setBar(id, v, max) {
    const pct = Math.max(0, v / max);
    $(id + "Bar").style.clipPath = "inset(0 " + ((1 - pct) * 100) + "% 0 0)";
    $(id + "Txt").textContent = Math.max(0, Math.ceil(v)) + "/" + max + " HP";
}
function floatText(el, txt, cls = "") {
    const f = document.createElement("div"); f.className = "float " + cls; f.textContent = txt;
    f.style.left = (el.offsetLeft + el.offsetWidth * 0.3) + "px"; f.style.top = (el.offsetTop + el.offsetHeight * 0.08) + "px";
    $("game").appendChild(f); setTimeout(() => f.remove(), 1000);
}
function anim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 400); }


/* ===== Balões de fala ===== */
const SAYS = {
    pl: {
        hit: ["Toma essa!", "Pela honra!", "Sinta minha lâmina!", "Recue, bruto!", "Em guarda!"],
        crit: ["GOLPE PERFEITO!", "PELA ARENA!", "NÃO TEM ESCAPATÓRIA!"],
        heal: ["Preciso de fôlego!", "Ainda não caí!"], win: ["Um a menos!", "Vitória!"]
    },
    en: {
        hit: ["Grrraaah!", "Vou te esmagar!", "Isso dói, né?", "Fraco!", "Sangue e glória!"],
        crit: ["MORRA, CAVALEIRO!", "RAAAAAAH!", "VOU TE PARTIR AO MEIO!"],
        heal: [], win: ["Hahaha! Fraco!", "Ninguém passa por mim!"]
    }
};
const pick = a => a[Math.floor(Math.random() * a.length)];
function speak(side, kind) {
    const list = SAYS[side][kind]; if (!list || !list.length) return;
    document.querySelectorAll(".bubble." + side).forEach(b => b.remove());
    const b = document.createElement("div");
    b.className = "bubble " + side + (kind === "crit" ? " big" : "");
    b.textContent = pick(list);
    if (side === "pl") { b.style.left = "26.8%"; b.style.top = "43.5%"; }
    else { b.style.right = "29.6%"; b.style.top = "43.5%"; }
    $("game").appendChild(b);
    setTimeout(() => b.remove(), 2000);
}

/* ===== Ações ===== */
async function enemyTurn() {
    await wait(650);
    const e = S.enemy;
    const dmg = Math.round(e.atk * rnd(.8, 1.2));
    anim($("en"), "lungeL"); await wait(180);
    S.hp = Math.max(0, S.hp - dmg);
    anim($("pl"), "hit"); floatText($("pl"), "-" + dmg);
    say(e.name + " causou " + dmg + " de dano!");
    speak("en", dmg >= e.atk * 1.12 ? "crit" : "hit");
    render();
    if (S.hp <= 0) return defeat();
    S.busy = false; render();
}
async function attack() {
    if (S.busy || S.over || S.enemy.hp <= 0) return;
    S.busy = true; render();
    anim($("pl"), "lungeR"); await wait(180);
    let dmg = Math.round(atkValue() * rnd(.85, 1.15));
    const crit = Math.random() < .15; if (crit) dmg = Math.round(dmg * 1.6);
    S.enemy.hp = Math.max(0, S.enemy.hp - dmg);
    anim($("en"), "hit"); floatText($("en"), (crit ? "CRÍTICO! " : "") + "-" + dmg, crit ? "crit" : "");
    say("Você causou " + dmg + " de dano" + (crit ? " (crítico)" : "") + "!");
    speak("pl", crit ? "crit" : "hit");
    render();
    if (S.enemy.hp <= 0) return victory();
    await enemyTurn();
}
function victory() {
    const r = S.enemy.reward; S.coins += r;
    $("en").classList.add("dead");
    say("Vitória! +" + r + " moedas. Avance para a próxima arena.");
    setTimeout(() => speak("pl", "win"), 350);
    S.busy = false; render();
}
function defeat() {
    setTimeout(() => speak("en", "win"), 300);
    S.over = true; $("pl").classList.add("dead"); render();
    setTimeout(() => endScreen("Derrota", "Você caiu na arena " + S.arena + "."), 700);
}
function endScreen(t, p) { $("endT").textContent = t; $("endP").textContent = p; $("ovEnd").classList.add("on"); }
async function usePotion() {
    if (S.busy || S.over || S.enemy.hp <= 0 || S.hp >= MAX_HP) return;
    if (S.potions > 0) S.potions--;
    else if (S.coins >= POTION_PRICE) S.coins -= POTION_PRICE;
    else return;
    S.busy = true;
    const heal = Math.min(POTION_HEAL, MAX_HP - S.hp); S.hp += heal;
    floatText($("pl"), "+" + heal, "heal"); say("Você recuperou " + heal + " HP.");
    speak("pl", "heal");
    render(); await enemyTurn();
}
function nextArena() {
    if (S.enemy.hp > 0 || S.busy || S.over) return;
    S.arena++; S.enemy = newEnemy(S.arena);
    const healed = MAX_HP - S.hp; S.hp = MAX_HP;
    $("en").classList.remove("dead");
    say("Arena " + S.arena + " — " + S.enemy.name + " aparece!" + (healed > 0 ? " Você recuperou " + healed + " HP." : ""));
    if (healed > 0) floatText($("pl"), "+" + healed, "heal");
    render();
}
function flee() {
    if (S.over) return;
    S.over = true; render();
    endScreen("Você fugiu", "Chegou até a arena " + S.arena + " com " + S.coins + " moedas.");
}

/* ===== Armas ===== */
function openWeapons() {
    const box = $("wlist"); box.innerHTML = "";
    if (!WEAPONS.length) { const e = document.createElement("p"); e.textContent = "O arsenal está vazio."; box.appendChild(e); }
    WEAPONS.forEach((w, i) => {
        const row = document.createElement("div"); row.className = "witem";
        const info = document.createElement("span"); info.textContent = w.icon + " " + w.name + " — Ataque " + w.atk;
        const b = document.createElement("button");
        if (S.weapon === i) { b.textContent = "Equipada"; b.disabled = true; }
        else if (S.owned[i]) { b.textContent = "Equipar"; b.onclick = () => { S.weapon = i; render(); openWeapons(); say("Equipou " + w.name + "."); }; }
        else {
            b.textContent = "Comprar (" + w.price + ")"; b.disabled = S.coins < w.price;
            b.onclick = () => { S.coins -= w.price; S.owned[i] = true; S.weapon = i; render(); openWeapons(); say("Comprou e equipou " + w.name + "!"); };
        }
        row.append(info, b); box.appendChild(row);
    });
    $("ovWeap").classList.add("on");
}

$("bAtk").onclick = attack;
$("bPot").onclick = usePotion;
$("bNext").onclick = nextArena;
$("bWeap").onclick = openWeapons;
$("wclose").onclick = () => $("ovWeap").classList.remove("on");
$("flee").onclick = flee;
$("endBtn").onclick = newGame;
document.addEventListener("keydown", e => { if (e.key === " " || e.key === "a") { e.preventDefault(); attack(); } });
newGame();