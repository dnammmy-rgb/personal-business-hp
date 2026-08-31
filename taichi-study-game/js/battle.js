// バトル進行の共通ロジック。画面描画はcallbacks経由でmain.js側に任せる。
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

  function answer(chosenValue) {
    const correct = chosenValue === state.currentQuestion.answer;

    if (correct) {
      state.monsterHp -= 1;
      callbacks.onCorrect(state);

      if (state.monsterHp <= 0) {
        const defeatedIndex = state.monsterIndex;
        state.monsterIndex += 1;

        if (state.monsterIndex >= state.monsters.length) {
          finish(true);
          return;
        }

        callbacks.onMonsterDefeated(defeatedIndex, state, () => enterMonster());
        return;
      }
    } else {
      state.mistakes += 1;
      state.playerHp -= 1;
      callbacks.onWrong(state);

      if (state.playerHp <= 0) {
        finish(false);
        return;
      }
    }

    askNextQuestion();
  }

  function finish(cleared) {
    const seconds = Math.round((Date.now() - state.startedAt) / 1000);
    const result = { cleared, mistakes: state.mistakes, seconds };
    callbacks.onFinish(result);
  }

  return { start, answer, currentMonster };
}
