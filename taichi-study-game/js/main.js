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
    monsterGroup: document.getElementById("monster-group"),
    monsterName: document.getElementById("monster-name"),
    monsterHpBar: document.getElementById("monster-hp-bar"),
    questionText: document.getElementById("question-text"),
    answerForm: document.getElementById("answer-form"),
    answerInput: document.getElementById("answer-input"),
    answerSubmit: document.getElementById("answer-submit"),
    formulaChoiceList: document.getElementById("formula-choice-list"),
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
    el.formulaChoiceList.querySelectorAll(".formula-choice-btn").forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  function renderPlayerHp(hp) {
    el.playerHp.textContent = "❤️".repeat(Math.max(hp, 0)) + "🖤".repeat(PLAYER_HP_MAX - Math.max(hp, 0));
  }

  // monsters は現状つねに1体だが、ザコ敵が複数同時に並ぶ画面にも対応できるよう配列で受け取る
  function renderMonsterGroup(monsters) {
    el.monsterGroup.innerHTML = "";
    el.monsterGroup.dataset.count = String(monsters.length);
    monsters.forEach((monster) => {
      const img = document.createElement("img");
      img.src = monster.image;
      img.alt = monster.name;
      img.className = `monster-image monster-image--${monster.tier}`;
      el.monsterGroup.appendChild(img);
    });
  }

  function renderMonster(monster) {
    renderMonsterGroup([monster]);
    el.monsterName.textContent = monster.name;
  }

  function renderMonsterHp(monster, hp) {
    const ratio = Math.max(hp, 0) / monster.hpMax;
    el.monsterHpBar.style.width = `${ratio * 100}%`;
  }

  function playKickEffect() {
    el.monsterGroup.querySelectorAll(".monster-image").forEach((img) => {
      img.classList.remove("hit");
      void img.offsetWidth; // reflow でアニメーションを再スタートさせる
      img.classList.add("hit");
    });
  }

  function renderQuestion(question, state) {
    setMessage("");
    el.monsterIndex.textContent = state.monsterIndex + 1;
    el.monsterTotal.textContent = state.monsters.length;
    el.questionText.textContent = question.question;
    el.questionText.classList.toggle("question-text--word", question.type === "word");

    // 文章題は「式の3択」、九九の計算問題は数字入力で答える
    const isWord = question.type === "word";
    el.answerForm.hidden = isWord;
    el.formulaChoiceList.hidden = !isWord;

    if (isWord) {
      renderFormulaChoices(question);
    } else {
      el.answerInput.value = "";
      el.answerInput.focus();
    }

    setInputEnabled(true);
  }

  function renderFormulaChoices(question) {
    el.formulaChoiceList.innerHTML = "";
    question.choices.forEach((formula) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "formula-choice-btn";
      btn.textContent = formula;
      btn.addEventListener("click", () => onFormulaChoiceClick(question, btn, formula));
      el.formulaChoiceList.appendChild(btn);
    });
  }

  function onFormulaChoiceClick(question, btn, formula) {
    if (btn.disabled) return;
    const isCorrect = formula === question.formula;
    btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
    if (!isCorrect) {
      el.formulaChoiceList.querySelectorAll(".formula-choice-btn").forEach((b) => {
        if (b.textContent === question.formula) b.classList.add("is-correct");
      });
    }
    // 正誤判定は式を選んだ時点で確定する。battle.jsの数値比較の仕組みをそのまま使うため、
    // 正解なら本来の答え、不正解なら絶対に一致しない値(answer+1)を渡す。
    battle.answer(isCorrect ? question.answer : question.answer + 1);
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
    const correctLabel = question.type === "word" ? `せいかいの式は ${question.formula}` : `こたえは ${question.answer}`;
    setMessage(`ざんねん…！ こうげきされた！（${correctLabel}）`);
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
        const defeated = state.monsters[defeatedIndex];
        setMessage(`${defeated.revealName || defeated.name}をたおした！`);
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
