"use strict";
import { SAKURA_SVG } from "./sakuraSvg.js";

// 初期0カウントデータの配列
// ＊先頭に固定表示するメッセージ
const initialMessages = [
  {
    id: 0,
    formattedID: "00000000",
    message: "For my dear friends.\n私と話してくれてありがとう🐰",
    approved: true,
  },
];

// 画面全体で共有するメッセージ一覧（初期データ + DBから取得したデータ）
let allMessages = [...initialMessages];

/**
 * カウンター数値を8桁の文字列（ゼロパディング）に整形する
 * @param {number} count - メッセージの件数
 * @returns {string} 8桁に整形された文字列（例: "00000000"）
 */
function formatCount(count) {
  return String(count).padStart(8, '0');
}

/**
 * メッセージカウンターの表示を更新する関数
 * @param {number} count - 表示する件数
 * @returns
 */
function updateCounter(count) {
  const counterEl = document.getElementById("counter-display");
  if (!counterEl) return;
    // 数字を1文字ずつ <span>0</span> に分解してセット
    // 「split 分解する ➔ map 包む ➔ join 結合する」の動き
  const formattedCount = formatCount(count);
  counterEl.innerHTML = formattedCount
    .split("")
    .map(num => `<span>${num}</span>`)
    .join("");
}

/**
 * 桜の花を1輪生成して画面に追加する関数
 * @param {boolean} isCenter - trueなら中央（0番目）、falseならランダム配置
 */
function addSingleSakura(isCenter = false) {
  const container = document.getElementById("sakura-container");
  if (!container) return;

  const sakura = document.createElement("div");
  sakura.classList.add("sakura");
  sakura.innerHTML = SAKURA_SVG;

  if (isCenter) {
    sakura.style.left = "calc(50% - 0.9rem)";
    sakura.style.top = "44%";
  } else {
    sakura.style.left = `${Math.random() * 90}%`;
    sakura.style.top = `${Math.random() * 80}%`;
  }

  sakura.style.animationDelay = `${Math.random() * 3}s`;
  container.appendChild(sakura);
}

/**
 * 桜の花を件数分生成する関数
 * @param {number} count - 描画する桜の総数
 */
function renderSakura(count) {
  const container = document.getElementById("sakura-container");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    addSingleSakura(i === 0);
  }
}

/**
 * メッセージカード一覧をHTMLに描画する関数（XSS対策済み）
 * @param {Array} messages - 表示するメッセージ配列
 */
function renderMessageList(messages) {
  const container = document.getElementById("message-card-container");
  if (!container) return;
  container.innerHTML = "";

  messages.forEach((item) => {
    const card = document.createElement("div");
    card.className = "message-card";

    const idDiv = document.createElement("div");
    idDiv.className = "card-id";
    idDiv.textContent = item.formattedID || formatCount(item.id);

    const textP = document.createElement("p");
    textP.className = "card-text";
    textP.textContent = item.message;

    card.appendChild(idDiv);
    card.appendChild(textP);
    container.appendChild(card);
  });
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

/**
 * APIから承認済みメッセージ一覧を取得して画面に反映する
 */
async function loadMessagesFromServer() {
  try {
    const response = await fetch("/api/messages");
    if (!response.ok) {
      throw new Error("メッセージの取得に失敗しました");
    }
    const dbMessages = await response.json();

    // DBの各レコードに8桁の formattedID を付与
    const formattedDbMessages = dbMessages.map((item) => ({
      ...item,
      formattedID: formatCount(item.id),
    }));

    allMessages = [...initialMessages, ...formattedDbMessages];
  } catch (error) {
    console.error("Load error:", error);
    // 通信失敗時は初期データのみで表示を継続
    allMessages = [...initialMessages];
  }

  // カウンター更新（初期データ1件を除いたDB登録件数）
  const userMessageCount = Math.max(0, allMessages.length - 1);
  updateCounter(userMessageCount);

  // トップのメッセージ表示（最新メッセージがあればそれを表示、なければ初期メッセージ）
  const messageEl = document.querySelector(".message-text");
  if (messageEl) {
    const latestMessage = allMessages[allMessages.length - 1];
    messageEl.textContent = latestMessage.message;
  }

  // 桜の描画処理（初期1輪 + DBの件数分）
  renderSakura(allMessages.length);
}

// ★初期化処理（画面の準備が整ったら実行）★
document.addEventListener("DOMContentLoaded", async () => {
  // --- 1〜3. サーバーからデータを取得し、カウンター・メッセージ・桜を描画 ---
  await loadMessagesFromServer();

  // --- 4. 数秒後に出現させるHTML(使い方・フォーム) ---
  setTimeout(() => {
    const fadeTargets = document.querySelectorAll(".fade-in-target");
    fadeTargets.forEach((target) => {
      target.classList.add("is-visible");
    });
  }, 3000);

  // --- 5. 画面切り替え処理（トップ ⇄ 一覧） ---
  const topView = document.getElementById("top-view");
  const listView = document.getElementById("list-view");
  const btnShowList = document.getElementById("btn-show-list");
  const btnBackTop = document.getElementById("btn-back-top");

  // 「みんなのメッセージをみる」ボタンクリック時
  if (btnShowList) {
    btnShowList.addEventListener("click", () => {
      renderMessageList(allMessages);
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

  // --- 6. タイトルのタイプライター表示 ---
  const titleEl = document.querySelector("#top-view h1");
  if (titleEl) {
    typeWriter(titleEl, "ありがとうの花", 150);
  }

  // --- 7. 投稿フォームの送信処理（API連携） ---
  const messageForm = document.querySelector(".message-form");
  const usageFormSection = document.getElementById("usage-form-section");
  const textarea = messageForm ? messageForm.querySelector("textarea") : null;

  if (messageForm && textarea) {
    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const text = textarea.value.trim();
      if (!text) {
        alert("メッセージ入力してね🐰");
        return;
      }

      const submitBtn = messageForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "送信に失敗しました...");
          return;
        }

        // 保存成功：新しいメッセージに formattedID を付けて配列に追加
        const newMessage = {
          ...data,
          formattedID: formatCount(data.id),
        };
        allMessages.push(newMessage);

        // カウンターを +1 更新
        const userMessageCount = Math.max(0, allMessages.length - 1);
        updateCounter(userMessageCount);

        // 桜の花を1輪追加
        addSingleSakura(false);

        // トップのメッセージ表示を今投稿した内容に更新
        const messageEl = document.querySelector(".message-text");
        if (messageEl) {
          messageEl.textContent = newMessage.message;
        }

        // 入力欄をクリアし、フォームエリアをフェードアウト非表示にする
        messageForm.reset();
        if (usageFormSection) {
          usageFormSection.classList.remove("is-visible");
        }
      } catch (error) {
        console.error("Submit error:", error);
        alert("通信エラーが発生しました。もう一度お試しください。");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});