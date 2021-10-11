// (start)baseを選択する>四則演算を選ぶ(middle)>subを選ぶ(end)>四則演算か=を選択する(middle or start)

// variale
const calPhase = {
  start: 0,
  middle: 1,
  end: 2,
};
const initalNumber = {
  base: "",
  sub: "",
  ari: "",
  phase: calPhase.start,
};

let globalNumber = {
  ...initalNumber,
};

// function
const resetArray = () => {
  globalNumber = { ...initalNumber };
  totalPointElement.innerHTML = 0;
};

const isdecimalPoint = (e, stringNum) => {
  return !stringNum.includes(e);
};

const adjustedNumberOfDigits = (n) => {
  const num = 16;
  let nString = String(n);
  if (nString.length > num) {
    nString = nString.slice(nString.length - num);
    console.log(nString);
  }
  return Number(nString);
};

const processNumber = (cir) => {
  globalNumber = {
    ...globalNumber,
    base: Number(globalNumber.base),
    sub: Number(globalNumber.sub),
  };

  const arithmetic = {
    sum: globalNumber.base + globalNumber.sub,
    sub: globalNumber.base - globalNumber.sub,
    mult: adjustedNumberOfDigits(globalNumber.base * globalNumber.sub),
    div: globalNumber.base / globalNumber.sub,
  };

  return arithmetic[cir];
};

const totalNumber = () => {
  const result = processNumber(globalNumber.ari);
  globalNumber = {
    ...globalNumber,
    base: (Math.round(result * 1000) / 1000).toString(),
    sub: "",
  };

  totalPointElement.innerHTML = globalNumber.base;
};

const outputAction = () => {
  if (
    globalNumber.phase === calPhase.start ||
    globalNumber.phase === calPhase.middle
  ) {
    return;
  }
  totalNumber();
  globalNumber = { ...globalNumber, phase: calPhase.start, ari: "" };
  return;
};

const cirAction = (e) => {
  //四則演算を連続で押したらリターン
  if (globalNumber.phase === calPhase.middle) {
    return;
  }
  //sub選択後の場合は、計算してしまう。
  if (globalNumber.phase === calPhase.end) {
    totalNumber();
    globalNumber = {
      ...globalNumber,
      phase: calPhase.middle,
      ari: e.dataset.key,
    };
    return;
  }
  globalNumber = {
    ...globalNumber,
    phase: calPhase.middle,
    ari: e.dataset.key,
  };
  return;
};

const actionFirstPhase = (e) => {
  // 最初に小数点を押したら0を頭にのせる
  if (globalNumber.base.length === 0 && e.dataset.key === ".") {
    globalNumber.base = "0";
    globalNumber.base += e.dataset.key;
    return;
  }
  //base 最初に "0"を押し、次に"."を押さなかった場合、"."を押すまでエスケープする
  if (
    globalNumber.base.length === 1 &&
    globalNumber.base[0] === "0" &&
    e.dataset.key !== "."
  ) {
    globalNumber.base = globalNumber.base.slice(1);
    return;
  }

  //baseを計算する
  if (
    e.dataset.key === "." &&
    !isdecimalPoint(e.dataset.key, globalNumber.base)
  ) {
    return;
  }
  if (globalNumber.base.length > 10) {
    return;
  }
  globalNumber.base += e.dataset.key;
  totalPointElement.innerHTML = globalNumber.base;
};

const createNumber = (e) => {
  // baseを入力。四則演算選択前
  if (globalNumber.phase === calPhase.start) {
    actionFirstPhase(e);
    return;
  }
  //sub 最初に "." を押された場合の処理
  if (globalNumber.sub.length === 0 && e.dataset.key === ".") {
    globalNumber.sub = "0";
    globalNumber.sub += e.dataset.key;
    return;
  }
  //sub 最初に "0"を押し、次に"."を押さなかった場合、"."を押すまでエスケープする
  if (
    globalNumber.sub.length === 1 &&
    globalNumber.sub[0] === "0" &&
    e.dataset.key !== "."
  ) {
    globalNumber.sub = globalNumber.sub.slice(1);
    return;
  }
  //subを計算する
  if (
    e.dataset.key === "." &&
    !isdecimalPoint(e.dataset.key, globalNumber.sub)
  ) {
    return;
  }
  //四則演算を選択後にsubを入力したことを確認。
  if (globalNumber.phase === calPhase.middle) {
    globalNumber.phase = calPhase.end;
  }

  if (globalNumber.sub.length > 10) {
    return;
  }
  globalNumber.sub += e.dataset.key;
  totalPointElement.innerHTML = globalNumber.sub;
};

// dom
//数値の要素（.）含むdom取得
const buttonsElement = document.querySelectorAll(".js-button");
//arithmeticのdom取得
const actionButtonsElement = document.querySelectorAll(".js-action-button");
//合計値表示dom
const totalPointElement = document.querySelector(".total-point");
//初期化するdom
const resetButtonElement = document.querySelector(".js-reset-button");
//出力するdom
const outputButtonElement = document.querySelector(".js-output-button");

resetButtonElement.addEventListener("click", () => {
  resetArray();
});

buttonsElement.forEach((item) => {
  item.addEventListener("click", () => {
    createNumber(item);
  });
});

outputButtonElement.addEventListener("click", () => {
  outputAction();
});

actionButtonsElement.forEach((item) => {
  item.addEventListener("click", () => {
    cirAction(item);
  });
});
