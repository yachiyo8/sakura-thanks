"use strict";
import { SAKURA_SVG } from "./sakuraSvg.js";

// 初期0カウントデータの配列
// ＊将来的にDB管理する時、Firebaseからデータを取得する処理（SDKの読み込み）に差替える
const initialMessages = [
  {
    id: 0,
    formattedID: "00000000",
    message: "For my dear friends.\n私と話してくれてありがとう🐰",
    approved: true,
  },/*
  {
    id: 2,
    formattedID: "00000000",
    message: "ここにメッセージを入れます。最大文字数は100文字です。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章の文字量が100文字です。素敵なメッセージをどうぞ。",
    approved: true,
  },
  {
    id: 3,
    formattedID: "00000000",
    message: "test",
    approved: true,
  },
  {
    id: 4,
    formattedID: "00000000",
    message: "test",
    approved: true,
  },
  {
    id: 5,
    formattedID: "00000000",
    message: "test",
    approved: true,
  },
  {
    id: 6,
    formattedID: "00000000",
    message: "test",
    approved: true,
  },
  {
    id: 7,
    formattedID: "00000000",
    message: "test",
    approved: true,
  },
  {
    id: 8,
    formattedID: "00000000",
    message: "test",
    approved: true,
  },*/
];

/**
 * カウンター数値を8桁の文字列（ゼロパディング）に整形する
 * @param {number} count - メッセージの件数
 * @returns {string} 8桁に整形された文字列（例: "00000000"）
 */
function formatCount(count) {
  return String(count).padStart(8, 0);
}

// 桜の花を件数分生成する関数
function renderSakura(count) {
  const container = document.getElementById("sakura-container");
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const sakura = document.createElement("div");
    sakura.classList.add("sakura");
    sakura.innerHTML = SAKURA_SVG;

    if (i == 0){
      // 0番目（初期の1つ目）は画面の中央に配置
      sakura.style.left = "calc(50% - 0.9rem)"; // 横中央（文字サイズの半分オフセット）
      sakura.style.top = "44%"; // 縦のやや中央寄り
    }else {
      // 2つ目以降はランダム配置（単位は %）
      sakura.style.left = `${Math.random() * 90}%`;
      sakura.style.top = `${Math.random() * 80}%`;
    }

  // アニメーションのタイミングをずらす（単位は s）
  sakura.style.animationDelay = `${Math.random() * 3}s`;

  // ループの中で画面に追加する
    container.appendChild(sakura);
     }
}

// メッセージカード一覧をHTMLに描画する関数
function renderMessageList(messages) {
  const container = document.getElementById("message-card-container");
  if (!container) return;

  container.innerHTML = messages
    .map((item) => `<div class="message-card">
      <div class="card-id">${item.formattedID}</div>
      <p class="card-text">${item.message}</p>
    </div>`)
    .join("");
}

  // テキストを1文字ずつ表示する関数
  function typeWriter(element, text, speed = 150) {
    element.textContent = ""; // 一旦テキストを空にする
    let i = 0;

    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer); //文字を出し切ったらタイマー停止
      }
    }, speed); //文字が出るスピード（ミリ秒）
}

// ★初期化処理（画面の準備が整ったら実行）★
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. カウンターの表示処理 ---
  const counterEl = document.querySelector(".counter-num");
  const currentCount = initialMessages[0].id;

    // 関数を呼び出して画面にセット
    // 数字を1文字ずつ <span>0</span> に分解してセット
    // 「split 分解する ➔ map 包む ➔ join 結合する」の動き

    if (counterEl) {
      const formattedCount = formatCount(currentCount);
      counterEl.innerHTML = formattedCount
      .split("")
      .map(num => `<span>${num}</span>`)
        .join("");
  }
  // --- 2. メッセージの表示処理（★改行処理） ---
  const messageEl = document.querySelector(".message-text");
  if (messageEl) {
    messageEl.textContent = initialMessages[0].message;
  }

  // --- 3. 桜の描画処理 ---
  renderSakura(initialMessages.length);

  // --- 4. 数秒後に出現させるHTML(使い方・フォーム)
  setTimeout(() => {
    const fadeTargets = document.querySelectorAll(".fade-in-target");
    fadeTargets.forEach((target) => {
      target.classList.add("is-visible");
    });
  }, 2500);

  // --- 5. 画面切り替え処理（トップ ⇄ 一覧） ---
  const topView = document.getElementById("top-view");
  const listView = document.getElementById("list-view");
  const btnShowList = document.getElementById("btn-show-list");
  const btnBackTop = document.getElementById("btn-back-top");

  // 「みんなのメッセージをみる」ボタンクリック時
  if (btnShowList) {
    btnShowList.addEventListener("click", () => {
      renderMessageList(initialMessages);
      if (topView) topView.classList.add("is-hidden");
      if (listView) listView.classList.remove("is-hidden");
      window.scrollTo(0, 0);
    });
  }

  // 「トップにもどる」ボタンクリック時
  if (btnBackTop) {
    btnBackTop.addEventListener("click", () => {
      if (listView) listView.classList.add("is-hidden");
      if (topView) topView.classList.remove("is-hidden");
      window.scrollTo(0, 0);
    });
  }

  // --- 6. タイトルのタイプライター表示
  const titleEl = document.querySelector("#top-view h1");
  if (titleEl) {
    typeWriter(titleEl, "ありがとうの花", 150)
  }

  // --- 99. 未実装の部分の仮処理アラート
  // 投稿フォームの処理
  const messageForm = document.querySelector(".message-form");
  const usageFormSection = document.getElementById("usage-form-section");
  if (messageForm) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // アラートを表示（OKを押すまでここで一時停止）
      alert("まだ実装してません！もうちょっと待ってて🐰");
      // 入力欄をクリア
      messageForm.reset();
      // 使い方とフォームのエリアをフェードアウト非表示にする
      if (usageFormSection) {
        usageFormSection.classList.remove("is-visible");
      }
    });
  }
});
