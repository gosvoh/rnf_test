const squares = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
};
let isClicked = false;
let wrapper = document.getElementById("wrapper");

function countClick(btn) {
  if (!isClicked && btn.id === "1") startCountdown();
  squares[btn.id] += 1;
}

function startCountdown() {
  isClicked = true;
  let squaresDivs = wrapper.getElementsByClassName("square");
  let currentSquare = 0;

  let interval = setInterval(() => {
    squaresDivs.item(currentSquare).style.visibility = "hidden";
    squaresDivs.item(currentSquare).classList.remove("active");
    currentSquare++;
    if (currentSquare === squaresDivs.length) {
      localStorage.setItem(
        `squares${squaresDivs.length}`,
        JSON.stringify(squares)
      );

      wrapper.innerHTML = `<a class="next" href="${
        squaresDivs.length === 6 ? "butterfly.html" : "drag.html"
      }">Next</a>`;
      wrapper.style.gridTemplateRows = "1fr";
      wrapper.style.alignItems = "center";

      clearInterval(interval);
    } else squaresDivs.item(currentSquare).classList.add("active");
  }, 5000);
}
