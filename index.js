const calPhase = {
  start: 0,
  middle: 1,
  end: 2,
};

const globalNumber = {
  base: "",
  sub: "",
  ari: "",
  phase: calPhase.start,
};

const Arithmetic = {
  sum: "+",
  sub: "-",
  mult: "*",
  divi: "%",
};

//数値の要素（.）含むdom取得
const buttonsElement = document.querySelectorAll(".js-button");
//Arithmeticのdom取得
const actionButtonsElement = document.querySelectorAll(".js-action-button");
//合計値表示dom
const totalPointElement = document.querySelector(".total-point");
//初期化するdom
const resetButtonElement = document.querySelector(".js-reset-button");
//出力するdom
const outputButtonElement = document.querySelector(".js-output-button");

//リセットアクション
resetButtonElement.addEventListener("click", resetArray);
function resetArray() {
  globalNumber.base = 0;
  globalNumber.sub = "";
  globalNumber.ari = "";
  globalNumber.phase = calPhase.start;
  globalNumber.base = "";
  totalPointElement.innerHTML = 0;
}

//計算するベースの数値を作る
buttonsElement.forEach((item) => {
  item.addEventListener("click", function () {
    createNumber(item);
  });
});
//baseとsubの数値を定義する。
function createNumber(e) {
  //ここから、base,sub共通の例外処理
  //base 最初に "." を押された場合の処理
  if (globalNumber.base.length === 0 && e.dataset.key === ".") {
    globalNumber.base = "0";
    globalNumber.base += e.dataset.key;
    return;
  }
  //sub 最初に "." を押された場合の処理
  if (globalNumber.sub.length === 0 && e.dataset.key === ".") {
    globalNumber.sub = "0";
    globalNumber.sub += e.dataset.key;
    return;
  }

  //base 最初に "0"を押し、次に"."を押さなかった場合、"."を押すまでエスケープする
  if (globalNumber.base.length === 1) {
    if (globalNumber.base[0] === "0" && e.dataset.key !== ".") {
      globalNumber.base = globalNumber.base.slice(1);
      return;
    }
  }

  //sub 最初に "0"を押し、次に"."を押さなかった場合、"."を押すまでエスケープする
  if (globalNumber.sub.length === 1) {
    if (globalNumber.sub[0] === "0" && e.dataset.key !== ".") {
      globalNumber.sub = globalNumber.sub.slice(1);
      return;
    }
  }
  //ここまで、base,sub共通の例外処理

  //baseを計算する
  if (globalNumber.phase === calPhase.start) {
    if (e.dataset.key === ".") {
      if (isdecimalPoint(e.dataset.key, globalNumber.base)) {
        globalNumber.base += e.dataset.key;
      }
    } else {
      globalNumber.base += e.dataset.key;
    }
    if (globalNumber.base.length > 10) {
      if (globalNumber.base[0] === "0") {
        globalNumber.base = globalNumber.base.slice(
          0,
          globalNumber.base.length - 1
        );
        totalPointElement.innerHTML = globalNumber.base;
      } else {
        globalNumber.base = globalNumber.base.slice(1);
        totalPointElement.innerHTML = globalNumber.base;
      }
    } else {
      totalPointElement.innerHTML = globalNumber.base;
    }
  }

  //subを計算する
  if (globalNumber.phase === calPhase.end) {
    if (e.dataset.key === ".") {
      if (isdecimalPoint(e.dataset.key, globalNumber.sub)) {
        globalNumber.sub += e.dataset.key;
      }
    } else {
      globalNumber.sub += e.dataset.key;
    }
    if (globalNumber.sub.length > 10) {
      if (globalNumber.sub[0] === "0") {
        globalNumber.sub = globalNumber.sub.slice(
          0,
          globalNumber.sub.length - 1
        );
        totalPointElement.innerHTML = globalNumber.sub;
      } else {
        globalNumber.sub = globalNumber.sub.slice(1);
        totalPointElement.innerHTML = globalNumber.sub;
      }
    } else {
      totalPointElement.innerHTML = globalNumber.sub;
    }
  }

  //四則演算を選択後にsubへ移行。
  if (globalNumber.phase === calPhase.middle) {
    globalNumber.phase = calPhase.end;
  }
}
//少数点が複数ないか。
function isdecimalPoint(e, num) {
  return !num.includes(e);
}

//＝のdomにイベントを付与
outputButtonElement.addEventListener("click", outputAction);
//＝を押した場合の動作
function outputAction() {
  if (globalNumber.phase === calPhase.middle) {
    return;
  }
  if (globalNumber.phase === calPhase.start) {
    return;
  }
  if (globalNumber.phase === calPhase.end) {
    totalNumber();
    globalNumber.phase = calPhase.start;
    globalNumber.ari = "";
  }
}

//四則演算domにイベントを付与

actionButtonsElement.forEach((item) => {
  item.addEventListener("click", function () {
    cirAction(item);
  });
});
//四則演算のイベント
function cirAction(e) {
  //四則演算を連続で押したらリターン
  if (globalNumber.phase === calPhase.middle) {
    return;
  }
  //四則演算を選択
  if (globalNumber.phase === calPhase.start) {
    globalNumber.phase = calPhase.middle;
    globalNumber.ari = e.dataset.key;
  }
  //subを選択後、base,subを計算する。
  if (globalNumber.phase === calPhase.end) {
    totalNumber();
    globalNumber.phase = calPhase.middle;
    globalNumber.ari = e.dataset.key;
  }
}

//実際の計算関数
function totalNumber() {
  const result = processNumber(globalNumber.ari);
  globalNumber.base = Math.round(result * 1000) / 1000;
  globalNumber.sub = "";
  totalPointElement.innerHTML = globalNumber.base;
}

//四則演算ごとに分て計算する
function processNumber(cir) {
  globalNumber.base = Number(globalNumber.base);
  globalNumber.sub = Number(globalNumber.sub);
  if (cir === Arithmetic.sum) {
    return globalNumber.base + globalNumber.sub;
  }
  if (cir === Arithmetic.sub) {
    return globalNumber.base - globalNumber.sub;
  }
  if (cir === Arithmetic.mult) {
    return adjustedNumberOfDigits(globalNumber.base * globalNumber.sub);
  }
  if (cir === Arithmetic.divi) {
    return globalNumber.base / globalNumber.sub;
  }
}

function adjustedNumberOfDigits(n) {
  const num = 16;
  let nString = String(n);
  if (nString.length > num) {
    nString = nString.slice(nString.length - num);
    console.log(nString);
  }
  return Number(nString);
}
