// エントリーポイント：画面切り替え・DOM描画・イベント配線をまとめる。
document.addEventListener("DOMContentLoaded", () => {
  const screens = {
    title: document.getElementById("screen-title"),
    modeSelect: document.getElementById("screen-mode-select"),
    battle: document.getElementById("screen-battle"),
    result: document.getElementById("screen-result"),
  };

  const el = {
    btnStart: document.getElementById("btn-start"),
    btnBackToTitle: document.getElementById("btn-back-to-title"),
    modeCards: document.querySelectorAll(".mode-card:not(.mode-card--disabled)"),
    playerHp: document.getElementById("player-hp"),
    monsterIndex: document.getElementById("monster-index"),
    monsterTotal: document.getElementById("monster-total"),
    monsterEmoji: document.getElementById("monster-emoji"),
    monsterName: document.getElementById("monster-name"),
    monsterHpBar: document.getElementById("monster-hp-bar"),
    questionText: document.getElementById("question-text"),
    choiceList: document.getElementById("choice-list"),
    battleMessage: document.getElementById("battle-message"),
    resultHeading: document.getElementById("result-heading"),
    resultDetail: document.getElementById("result-detail"),
    btnRetry: document.getElementById("btn-retry"),
    btnResultToTitle: document.getElementById("btn-result-to-title"),
  };

  const MODES = { kuku: KukuMode };
  let activeModeId = "kuku";
  let battle = null;
  let answering = false;

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("screen--active"));
    screens[name].classList.add("screen--active");
  }

  function renderPlayerHp(hp) {
    el.playerHp.textContent = "❤️".repeat(Math.max(hp, 0)) + "🖤".repeat(PLAYER_HP_MAX - Math.max(hp, 0));
  }

  function renderMonster(monster) {
    el.monsterEmoji.textContent = monster.emoji;
    el.monsterName.textContent = monster.name;
  }

  function renderMonsterHp(monster, hp) {
    const ratio = Math.max(hp, 0) / monster.hpMax;
    el.monsterHpBar.style.width = `${ratio * 100}%`;
  }

  function renderQuestion(question, state) {
    answering = false;
    el.battleMessage.textContent = "";
    el.monsterIndex.textContent = state.monsterIndex + 1;
    el.monsterTotal.textContent = state.monsters.length;
    el.questionText.textContent = question.text;
    el.choiceList.innerHTML = "";

    question.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => onChoiceClick(btn, choice, question));
      el.choiceList.appendChild(btn);
    });
  }

  function onChoiceClick(btn, choice, question) {
    if (answering) return;
    answering = true;

    const isCorrect = choice === question.answer;
    btn.classList.add(isCorrect ? "is-correct" : "is-wrong");

    if (!isCorrect) {
      [...el.choiceList.children].forEach((child) => {
        if (Number(child.textContent) === question.answer) {
          child.classList.add("is-correct");
        }
      });
    }

    setTimeout(() => battle.answer(choice), 500);
  }

  function startBattle(modeId) {
    activeModeId = modeId;
    const mode = MODES[modeId];

    battle = createBattle(mode, MONSTERS, {
      onQuestion(question, monster, state) {
        renderMonster(monster);
        renderMonsterHp(monster, state.monsterHp);
        renderPlayerHp(state.playerHp);
        renderQuestion(question, state);
      },
      onCorrect(state) {
        el.monsterEmoji.classList.remove("hit");
        void el.monsterEmoji.offsetWidth; // reflow to restart animation
        el.monsterEmoji.classList.add("hit");
        el.battleMessage.textContent = "せいかい！ こうげき！";
        renderMonsterHp(state.monsters[state.monsterIndex], state.monsterHp);
      },
      onWrong(state) {
        el.battleMessage.textContent = "ざんねん…！ こうげきされた！";
        renderPlayerHp(state.playerHp);
      },
      onMonsterDefeated(defeatedIndex, state, proceed) {
        el.battleMessage.textContent = `${state.monsters[defeatedIndex].name}をたおした！`;
        setTimeout(proceed, 900);
      },
      onFinish(result) {
        showResult(result);
      },
    });

    showScreen("battle");
    battle.start();
  }

  function showResult(result) {
    const isBest = result.cleared && Storage.saveBestIfBetter(activeModeId, result);

    el.resultHeading.textContent = result.cleared ? "クリア！！" : "やられてしまった…";
    const lines = [
      `かかった時間：${result.seconds}びょう`,
      `まちがえた回数：${result.mistakes}かい`,
    ];
    if (isBest) lines.push("★ ベストきろく こうしん！ ★");
    el.resultDetail.textContent = lines.join("\n");

    showScreen("result");
  }

  el.btnStart.addEventListener("click", () => showScreen("modeSelect"));
  el.btnBackToTitle.addEventListener("click", () => showScreen("title"));
  el.btnResultToTitle.addEventListener("click", () => showScreen("title"));
  el.btnRetry.addEventListener("click", () => startBattle(activeModeId));

  el.modeCards.forEach((card) => {
    card.addEventListener("click", () => startBattle(card.dataset.mode));
  });
});
