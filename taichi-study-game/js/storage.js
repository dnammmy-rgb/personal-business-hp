// localStorageへの保存・読み込みをまとめたヘルパー。
const Storage = {
  keyBest(modeId) {
    return `taichiStudyGame_${modeId}_best`;
  },

  // クリアタイム(秒)・ミス数から「ベスト記録」を判定して保存する
  saveBestIfBetter(modeId, result) {
    const key = this.keyBest(modeId);
    const prev = this.loadBest(modeId);
    if (!prev || result.mistakes < prev.mistakes ||
        (result.mistakes === prev.mistakes && result.seconds < prev.seconds)) {
      localStorage.setItem(key, JSON.stringify(result));
      return true;
    }
    return false;
  },

  loadBest(modeId) {
    try {
      const raw = localStorage.getItem(this.keyBest(modeId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
};
