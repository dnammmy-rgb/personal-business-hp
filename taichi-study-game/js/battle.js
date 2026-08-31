// バトル進行の共通ロジック。画面描画・演出のタイミングはcallbacks経由でmain.js側に任せる。
const PLAYER_HP_MAX = 3;

function createBattle(mode, monsters, callbacks) {
  const state = {
    mode,
    monsters,
    monsterIndex: 0,
    monsterHp: 0,
    playerHp: PLAYER_HP_MAX,
    mistakes: 0,
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
    const chosenValue = Number(rawValue);
    const correct = chosenValue === question.answer;

    if (correct) {
      state.monsterHp -= 1;
      const defeatedIndex = state.monsterIndex;
      const defeated = state.monsterHp <= 0;

      callbacks.onCorrect(state, question, () => {
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
