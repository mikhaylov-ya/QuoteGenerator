let quoteElem = document.querySelector("#quote");
let newQuote = document.querySelector("#new_quote-btn");
let quoteAuthor = document.querySelector("#author");
let twtBtn = document.querySelector("#twitter-btn");
let loader = document.querySelector(".loader");
let quoteContainer = document.querySelector(".quote-wrapper");

// Лоадер
function loading(select) {
  if (select === true) {
    loader.classList.remove("hide");
    quoteContainer.classList.add("hide");
  } else if (select === false) {
    loader.classList.add("hide");
    quoteContainer.classList.remove("hide");
  }
}

function getNewQuote(data) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.parse.text["*"], "text/html");
  let quotes = doc.querySelectorAll("tr:not(.q-original) .poem > p");
  quotes = Array.from(quotes).filter((e) => e.textContent.length < 600);
  let quote = quotes[Math.floor(Math.random() * quotes.length)].textContent;

  // Вставляет данные в DOM
  function toPage(page, data) {
    page.innerHTML = data;
  }

  console.log(quote);
  quote = quote.replace(/\[[\d\d]\]/g, "");
  if (quote.length > 400) {
    quoteElem.classList.add("medium");
    quoteAuthor.classList.add("medium");
  } else {
    quoteElem.classList.remove("medium");
    quoteAuthor.classList.remove("medium");
  }

  let author = data.parse.title;
  toPage(quoteAuthor, author);
  toPage(quoteElem, quote);

  quoteElem.textContent.length + quoteAuthor.textContent.length > 240
    ? (twtBtn.disabled = true)
    : (twtBtn.disabled = false);

  loading(false);
}

function tweetQuote() {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${quoteElem.textContent} - ${quoteAuthor.textContent}`;
  window.open(tweetUrl, "_blank");
}

async function getQuotes() {
  loading(true);
  url = "https://ru.wikiquote.org/w/api.php";

  let pageids = [
    2955, 2213, 34, 993, 22272, 22517, 5679, 1009, 2967, 22326, 2663,
  ];
  // Лейбниц - 2955, Вольтер - 2213, Платон - 34, Аристотель - 993, Соловьёв - 22272, 1009 - Дидро, 2967 - Локк

  const randomPage = pageids[Math.floor(Math.random() * pageids.length)];
  queryPage = `${url}?action=parse&format=json&pageid=${randomPage}&prop=text&origin=*`;
  await fetch(queryPage)
    .then((response) => response.json())
    .then((data) => {
      loading(true);
      getNewQuote(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

getQuotes();
newQuote.onclick = getQuotes;
twtBtn.onclick = tweetQuote;
