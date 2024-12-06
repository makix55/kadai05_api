const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  console.log(res, "中身をチェック！resとはレスポンスの意味です🤗");
  
  if (!res.ok) {
    throw new Error('ポケモンデータの取得に失敗しました');
  }

  const pokemon = await res.json();
  console.log(pokemon, "中身をチェック");
  return pokemon;
};

// タイプのマッピング（英語 → 日本語）
const typeMapping = {
  "normal": "ノーマル",
  "fire": "ほのお",
  "water": "みず",
  "grass": "くさ",
  "electric": "でんき",
  "ice": "こおり",
  "fighting": "かくとう",
  "poison": "どく",
  "ground": "じめん",
  "flying": "ひこう",
  "psychic": "エスパー",
  "bug": "むし",
  "rock": "いわ",
  "ghost": "ゴースト",
  "dragon": "ドラゴン",
  "dark": "あく",
  "steel": "はがね",
  "fairy": "フェアリー"
};

// JSONデータの読み込み
let pokemonMap = {};

$.getJSON("pokemon.json", function(data) {
  pokemonMap = data;
}).fail(function() {
  console.error("pokemon.jsonの読み込みに失敗しました。");
});

// ポケモン情報を表示する関数
function displayPokemon(pokemon) {
  // タイプを日本語に変換
  const translatedTypes = pokemon.types.map(t => typeMapping[t.type.name] || t.type.name);

  const html = `
    <div>
      <p>No: ${pokemon.id}</p>
      <p>名前: ${pokemon.name}</p>
      <p>高さ: ${pokemon.height}</p>
      <p>重さ: ${pokemon.weight}</p>
      <p>HP: ${pokemon.stats[0].base_stat}</p>
      <p>攻撃: ${pokemon.stats[1].base_stat}</p>
      <p>防御: ${pokemon.stats[2].base_stat}</p>
      <p>特攻: ${pokemon.stats[3].base_stat}</p>
      <p>特防: ${pokemon.stats[4].base_stat}</p>
      <p>素早さ: ${pokemon.stats[5].base_stat}</p>
      <p>タイプ: ${translatedTypes.join(', ')}</p>
      <img src="${pokemon.sprites.front_default}" alt="Front Image" />
      <img src="${pokemon.sprites.back_default}" alt="Back Image" />
      <img src="${pokemon.sprites.front_default}" alt="Front Image" />
    </div>
  `;
  $(".list").html(html);
}

// 検索ボタンのクリックイベント
$("#aa").on("click", async function() {
  const inputName = $("#pokemon-name").val().trim();
  if (!inputName) {
    alert("ポケモンの名前を入力してください");
    return;
  }

  // カタカナ名を英語名に変換
  let englishName = null;
  $.each(pokemonMap, function(index, pokemon) {
    if (pokemon.ja === inputName) {
      englishName = pokemon.en;
      return false;
    }
  });

  if (!englishName) {
    $(".list").html("<p>該当するポケモンが見つかりませんでした。</p>");
    return;
  }

  try {
    const pokemonData = await getPokemon(englishName.toLowerCase());
    displayPokemon(pokemonData);
  } catch (error) {
    console.error("APIリクエストエラー:", error);
    $(".list").html("<p>該当するポケモンが見つかりませんでした。</p>");
  }
});

// 雪を生成する関数
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = "❄";

  const size = Math.random() * 1.5 + 1;
  const position = Math.random() * window.innerWidth;
  const duration = Math.random() * 10 + 5;

  snowflake.style.left = `${position}px`;
  snowflake.style.fontSize = `${size}rem`;
  snowflake.style.animationDuration = `${duration}s`;

  document.body.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}

// 定期的に雪を降らせる
setInterval(createSnowflake, 300);

