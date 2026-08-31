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
    answerForm: document.getElementById("answer-form"),
    answerInput: document.getElementById("answer-input"),
    answerSubmit: document.getElementById("answer-submit"),
    battleMessage: document.getElementById("battle-message"),
    resultHeading: document.getElementById("result-heading"),
    resultDetail: document.getElementById("result-detail"),
    btnRetry: document.getElementById("btn-retry"),
    btnResultToTitle: document.getElementById("btn-result-to-title"),
  };

  const MODES = { multiplication: MultiplicationMode };
  let activeModeId = "multiplication";
  let battle = null;

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("screen--active"));
    screens[name].classList.add("screen--active");
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setMessage(text) {
    el.battleMessage.textContent = text;
  }

  function formatFormula(question) {
    return `${question.formula.replace("×", " × ")} ＝ ${question.answer}`;
  }

  function setInputEnabled(enabled) {
    el.answerInput.disabled = !enabled;
    el.answerSubmit.disabled = !enabled;
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

  function playKickEffect() {
    el.monsterEmoji.classList.remove("hit");
    void el.monsterEmoji.offsetWidth; // reflow でアニメーションを再スタートさせる
    el.monsterEmoji.classList.add("hit");
  }

  function renderQuestion(question, state) {
    setMessage("");
    el.monsterIndex.textContent = state.monsterIndex + 1;
    el.monsterTotal.textContent = state.monsters.length;
    el.questionText.textContent = question.question;
    el.questionText.classList.toggle("question-text--word", question.type === "word");
    el.answerInput.value = "";
    setInputEnabled(true);
    el.answerInput.focus();
  }

  // 正解演出：「せいかい！」→（文章題なら式を1秒表示）→「キック！」の順で見せる
  async function playCorrectSequence(state, question, proceed) {
    setInputEnabled(false);
    setMessage("せいかい！");
    await sleep(600);

    if (question.type === "word") {
      setMessage(formatFormula(question));
      await sleep(1000);
    }

    setMessage("キック！");
    playKickEffect();
    renderMonsterHp(state.monsters[state.monsterIndex], state.monsterHp);
    await sleep(500);

    proceed();
  }

  async function playWrongSequence(state, question, proceed) {
    setInputEnabled(false);
    setMessage(`ざんねん…！ こうげきされた！（こたえは ${question.answer}）`);
    renderPlayerHp(state.playerHp);
    await sleep(900);
    proceed();
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
      onCorrect(state, question, proceed) {
        playCorrectSequence(state, question, proceed);
      },
      onWrong(state, question, proceed) {
        playWrongSequence(state, question, proceed);
      },
      onMonsterDefeated(defeatedIndex, state, proceed) {
        setMessage(`${state.monsters[defeatedIndex].name}をたおした！`);
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

  el.answerInput.addEventListener("input", () => {
    el.answerInput.value = el.answerInput.value.replace(/[^0-9]/g, "");
  });

  el.answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (el.answerInput.disabled) return;
    const raw = el.answerInput.value.trim();
    if (raw === "") return;
    battle.answer(raw);
  });
});
