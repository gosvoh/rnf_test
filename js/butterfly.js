let wrapper = document.getElementById("wrapper");
let grid = document.getElementById("grid");
let timer = document.getElementById("timer");
let timerStarted = false;
let timerValue = 20;
let columns = 0,
  rows = 0;
let tiles;
let clickCount = 0;

let startTime = -1;
let distance = -1;

let log = [];

timer.innerHTML = timerValue;

function createTile() {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.onclick = () => {
    if (!tile.querySelector(".butterfly")) return;

    clickCount++;

    tile.innerHTML = "";
    const randomTile = tiles.item(Math.floor(Math.random() * columns * rows));
    randomTile.appendChild(createButterfly());

    if (startTime === -1) {
      startTime = Date.now();
      distance = getLength(tile, randomTile);
      return;
    }

    const endTime = Date.now();
    distance = getLength(tile, randomTile);
    const time = (endTime - startTime) / 1000;
    startTime = Date.now();

    log.push({ distance, time });

    if (!timerStarted) startTimer();
  };
  return tile;
}

function createTiles(quantity) {
  Array.from(Array(quantity)).map(() => {
    grid.appendChild(createTile());
  });
}

function createButterfly() {
  const butterfly = document.createElement("div");
  butterfly.classList.add("butterfly");
  return butterfly;
}

(function createGrid() {
  grid.innerHTML = "";

  const size = 150;

  columns = Math.floor(grid.clientWidth / size);
  rows = Math.floor(grid.clientHeight / size);

  grid.style.setProperty("--columns", columns);
  grid.style.setProperty("--rows", rows);

  createTiles(columns * rows);

  tiles = grid.querySelectorAll(".tile");
  tiles
    .item(Math.floor(Math.random() * columns * rows))
    .appendChild(createButterfly());
})();

window.onresize = () => createGrid();

function getLength(tile1, tile2) {
  const tile1Rect = tile1.getBoundingClientRect();
  const tile2Rect = tile2.getBoundingClientRect();
  const x = tile1Rect.x - tile2Rect.x;
  const y = tile1Rect.y - tile2Rect.y;
  return Math.sqrt(x * x + y * y);
}

function startTimer() {
  timerStarted = true;
  let interval = setInterval(() => {
    timerValue--;
    timer.innerHTML = timerValue;
    if (timerValue < 0) {
      clearInterval(interval);
      wrapper.innerHTML = `<a class="next" href="squares.html">Next</a>`;
      wrapper.style.gridTemplateRows = "1fr";
      localStorage.setItem("butterfly", JSON.stringify({ clickCount, log }));
    }
  }, 1000);
}
