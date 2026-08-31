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
    btnMute: document.getElementById("btn-mute"),
    screenFlash: document.getElementById("screen-flash"),
    modeCards: document.querySelectorAll(".mode-card:not(.mode-card--disabled)"),
    playerHp: document.getElementById("player-hp"),
    monsterIndex: document.getElementById("monster-index"),
    monsterTotal: document.getElementById("monster-total"),
    monsterGroup: document.getElementById("monster-group"),
    monsterName: document.getElementById("monster-name"),
    monsterHpBar: document.getElementById("monster-hp-bar"),
    streakLabel: document.getElementById("streak-label"),
    questionText: document.getElementById("question-text"),
    answerForm: document.getElementById("answer-form"),
    answerInput: document.getElementById("answer-input"),
    answerSubmit: document.getElementById("answer-submit"),
    choiceList: document.getElementById("choice-list"),
    battleMessage: document.getElementById("battle-message"),
    resultHeading: document.getElementById("result-heading"),
    resultDetail: document.getElementById("result-detail"),
    btnRetry: document.getElementById("btn-retry"),
    btnResultToTitle: document.getElementById("btn-result-to-title"),
  };

  const MODES = { multiplication: MultiplicationMode, kanji: KanjiMode };
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

  // 九九モードは「キック」、漢字モードは「ブレイクキック」と、答えた種類によって技名を変える
  function attackLabelFor(question) {
    return question.type === "kanji" ? "ブレイクキック！" : "キック！";
  }

  function setInputEnabled(enabled) {
    el.answerInput.disabled = !enabled;
    el.answerSubmit.disabled = !enabled;
    el.choiceList.querySelectorAll(".choice-btn").forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  function renderPlayerHp(hp) {
    el.playerHp.textContent = "❤️".repeat(Math.max(hp, 0)) + "🖤".repeat(PLAYER_HP_MAX - Math.max(hp, 0));
  }

  function renderStreak(streak) {
    if (streak >= 2) {
      el.streakLabel.hidden = false;
      el.streakLabel.textContent = `れんぞく ${streak}かい せいかいちゅう！`;
    } else {
      el.streakLabel.hidden = true;
    }
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

  function playKickEffect(big) {
    el.monsterGroup.querySelectorAll(".monster-image").forEach((img) => {
      img.classList.remove("hit", "big-hit");
      void img.offsetWidth; // reflow でアニメーションを再スタートさせる
      img.classList.add(big ? "big-hit" : "hit");
    });
    if (big) {
      el.screenFlash.classList.remove("flash");
      void el.screenFlash.offsetWidth;
      el.screenFlash.classList.add("flash");
    }
  }

  function renderQuestion(question, state) {
    setMessage("");
    renderStreak(state.streak);
    el.monsterIndex.textContent = state.monsterIndex + 1;
    el.monsterTotal.textContent = state.monsters.length;
    el.questionText.textContent = question.question;
    el.questionText.classList.toggle("question-text--word", question.type === "word");

    // choicesを持つ問題（文章題・漢字）は選択式、九九の計算問題は数字入力
    const isChoice = Boolean(question.choices);
    el.answerForm.hidden = isChoice;
    el.choiceList.hidden = !isChoice;

    if (isChoice) {
      renderChoices(question);
    } else {
      el.answerInput.value = "";
      el.answerInput.focus();
    }

    setInputEnabled(true);
  }

  function renderChoices(question) {
    el.choiceList.innerHTML = "";
    el.choiceList.classList.toggle("choice-list--kanji", question.type === "kanji");
    question.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `choice-btn${question.type === "kanji" ? " choice-btn--kanji" : ""}`;
      btn.textContent = choice;
      btn.addEventListener("click", () => onChoiceClick(question, btn, choice));
      el.choiceList.appendChild(btn);
    });
  }

  function onChoiceClick(question, btn, choice) {
    if (btn.disabled) return;
    const isCorrect = choice === question.correctChoice;
    btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
    if (!isCorrect) {
      el.choiceList.querySelectorAll(".choice-btn").forEach((b) => {
        if (b.textContent === question.correctChoice) b.classList.add("is-correct");
      });
    }
    battle.answer(choice);
  }

  function wrongAnswerLabel(question) {
    if (question.type === "word") return `せいかいの式は ${question.formula}`;
    if (question.type === "kanji") return `せいかいは「${question.correctChoice}」`;
    return `こたえは ${question.answer}`;
  }

  // 正解演出：「せいかい！」→（文章題なら式を1秒表示）→ キック（または必殺技）の順で見せる
  async function playCorrectSequence(state, question, isSpecial, proceed) {
    setInputEnabled(false);
    renderStreak(state.streak);
    setMessage("せいかい！");
    await sleep(500);

    if (question.type === "word") {
      setMessage(formatFormula(question));
      await sleep(900);
    }

    if (isSpecial) {
      setMessage("れんぞく せいかい！ ひっさつわざ はつどう！");
      await sleep(600);
      setMessage("いかりのこぶし！！");
      playKickEffect(true);
      Sound.special();
    } else {
      setMessage(attackLabelFor(question));
      playKickEffect(false);
      Sound.correct();
    }
    renderMonsterHp(state.monsters[state.monsterIndex], state.monsterHp);
    await sleep(isSpecial ? 700 : 500);

    proceed();
  }

  async function playWrongSequence(state, question, proceed) {
    setInputEnabled(false);
    renderStreak(state.streak);
    setMessage(`ざんねん…！ こうげきされた！（${wrongAnswerLabel(question)}）`);
    renderPlayerHp(state.playerHp);
    Sound.wrong();
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
      onCorrect(state, question, isSpecial, proceed) {
        playCorrectSequence(state, question, isSpecial, proceed);
      },
      onWrong(state, question, proceed) {
        playWrongSequence(state, question, proceed);
      },
      onMonsterDefeated(defeatedIndex, state, proceed) {
        const defeated = state.monsters[defeatedIndex];
        setMessage(`${defeated.revealName || defeated.name}をたおした！`);
        Sound.defeat();
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

    if (result.cleared) Sound.clear();
    else Sound.gameOver();

    showScreen("result");
  }

  function updateMuteButton() {
    el.btnMute.textContent = Sound.isMuted() ? "🔇" : "🔊";
  }

  el.btnStart.addEventListener("click", () => {
    Sound.unlock();
    showScreen("modeSelect");
  });
  el.btnBackToTitle.addEventListener("click", () => showScreen("title"));
  el.btnResultToTitle.addEventListener("click", () => showScreen("title"));
  el.btnRetry.addEventListener("click", () => startBattle(activeModeId));

  el.btnMute.addEventListener("click", () => {
    Sound.unlock();
    Sound.setMuted(!Sound.isMuted());
    updateMuteButton();
  });
  updateMuteButton();

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
