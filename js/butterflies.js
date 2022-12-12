let wrapper = document.getElementById("wrapper");
let grid = document.getElementById("grid");
let timer = document.getElementById("timer");
let timerStarted = false;
let timerValue = 40;
let columns = 0,
  rows = 0;
let tiles;
let clickCount = 0;

timer.innerHTML = timerValue;

const createTile = () => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.onclick = () => {
    if (!tile.querySelector(".butterfly")) return;

    clickCount++;

    tile.innerHTML = "";
    const randomTile = tiles.item(Math.floor(Math.random() * columns * rows));
    randomTile.appendChild(createButterfly());
    if (!timerStarted) {
      timerStarted = true;
      let interval = setInterval(() => {
        timerValue--;
        timer.innerHTML = timerValue;
        if (timerValue < 0) {
          clearInterval(interval);
          wrapper.innerHTML = `<p class="score">Score: ${clickCount}</p>`;
          wrapper.style.gridTemplateRows = "1fr";
        }
      }, 1000);
    }
  };
  return tile;
};

const createTiles = (quantity) => {
  Array.from(Array(quantity)).map(() => {
    grid.appendChild(createTile());
  });
};

const createButterfly = () => {
  const butterfly = document.createElement("div");
  butterfly.classList.add("butterfly");
  return butterfly;
};

const createGrid = () => {
  grid.innerHTML = "";

  const size = grid.clientWidth > 800 ? 250 : 150;

  columns = Math.floor(grid.clientWidth / size);
  rows = Math.floor(grid.clientHeight / size);

  grid.style.setProperty("--columns", columns);
  grid.style.setProperty("--rows", rows);

  createTiles(columns * rows);

  tiles = grid.querySelectorAll(".tile");
  tiles
    .item(Math.floor(Math.random() * columns * rows))
    .appendChild(createButterfly());
};

createGrid();

window.onresize = () => createGrid();
