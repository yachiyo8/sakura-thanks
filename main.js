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
  },
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

// 初期化処理（画面の準備が整ったら実行）
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

  // --- 4. 2秒（2000ms）後に出現させるHTML
  setTimeout(() => {
    const fadeTargets = document.querySelectorAll(".fade-in-target");
    fadeTargets.forEach((target) => {
      target.classList.add("is-visible");
    });
  }, 1500);

  // --- 5. 未実装の部分の仮処理アラート
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
