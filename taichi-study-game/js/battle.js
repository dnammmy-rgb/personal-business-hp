// バトル進行の共通ロジック。画面描画・演出のタイミングはcallbacks経由でmain.js側に任せる。
const PLAYER_HP_MAX = 3;
const STREAK_FOR_SPECIAL = 3; // これだけ連続正解すると必殺技「怒りの拳」が出る

function createBattle(mode, monsters, callbacks) {
  const state = {
    mode,
    monsters,
    monsterIndex: 0,
    monsterHp: 0,
    playerHp: PLAYER_HP_MAX,
    mistakes: 0,
    streak: 0,
    startedAt: 0,
    currentQuestion: null,
  };

  function currentMonster() {
    return state.monsters[state.monsterIndex];
  }

  function start() {
    if (typeof mode.reset === "function") mode.reset();
    state.monsterIndex = 0;
    state.playerHp = PLAYER_HP_MAX;
    state.mistakes = 0;
    state.streak = 0;
    state.startedAt = Date.now();
    enterMonster();
  }

  function enterMonster() {
    state.monsterHp = currentMonster().hpMax;
    askNextQuestion();
  }

  function askNextQuestion() {
    state.currentQuestion = mode.nextQuestion();
    callbacks.onQuestion(state.currentQuestion, currentMonster(), state);
  }

  // 正解/不正解いずれも、演出(キック等)が終わってからcallbacks側がproceed()を呼ぶことで
  // 次の問題やモンスター撃破処理に進む。演出中に状態が先走らないようにするための仕組み。
  function answer(rawValue) {
    const question = state.currentQuestion;
    // 数字入力(九九)は answer、3択(文章題・漢字)は correctChoice で正誤判定する
    const target = question.correctChoice !== undefined ? question.correctChoice : question.answer;
    const correct = String(rawValue) === String(target);

    if (correct) {
      state.streak += 1;
      const isSpecial = state.streak >= STREAK_FOR_SPECIAL;
      const monster = currentMonster();
      // 必殺技「怒りの拳」：ザコ敵は残りHPに関わらず一撃で撃破、中ボス・ラスボスはHPを半分削る
      const damage = isSpecial
        ? (monster.tier === "zako" ? state.monsterHp : Math.max(1, Math.ceil(state.monsterHp / 2)))
        : 1;
      if (isSpecial) state.streak = 0;

      state.monsterHp -= damage;
      const defeatedIndex = state.monsterIndex;
      const defeated = state.monsterHp <= 0;

      callbacks.onCorrect(state, question, isSpecial, () => {
        if (!defeated) {
          askNextQuestion();
          return;
        }
        // 最後の1体（ラスボス）を倒した場合も、必ずonMonsterDefeatedを経由させる。
        // ラスボスの名前(revealName)の演出はここで表示されるため。
        callbacks.onMonsterDefeated(defeatedIndex, state, () => {
          state.monsterIndex += 1;
          if (state.monsterIndex >= state.monsters.length) {
            finish(true);
          } else {
            enterMonster();
          }
        });
      });
      return;
    }

    state.streak = 0;
    state.mistakes += 1;
    state.playerHp -= 1;
    const dead = state.playerHp <= 0;

    callbacks.onWrong(state, question, () => {
      if (dead) {
        finish(false);
      } else {
        askNextQuestion();
      }
    });
  }

  function finish(cleared) {
    const seconds = Math.round((Date.now() - state.startedAt) / 1000);
    callbacks.onFinish({ cleared, mistakes: state.mistakes, seconds });
  }

  return { start, answer, currentMonster };
}
