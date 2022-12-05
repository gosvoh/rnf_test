const squares = {
  square1: 0,
  square2: 0,
  square3: 0,
  square4: 0,
  square5: 0,
  square6: 0,
};
let isClicked = false;

function countClick(btn) {
  squares[btn.id] += 1;
  if (!isClicked) startCountdown();
}

function startCountdown() {
  isClicked = true;
  let wrapper = document.getElementById("wrapper");
  setTimeout(function () {
    // squares to table and clear wrapper
    wrapper.innerHTML = "";
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML = "Square";
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = "Clicks";
    tr.appendChild(th);
    thead.appendChild(tr);
    table.appendChild(thead);
    for (let key in squares) {
      tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = key;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = squares[key];
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrapper.appendChild(table);
    wrapper.style.gridTemplateColumns = "1fr";
    wrapper.style.width = "auto";
  }, 15000);
}

function createDragFrame() {
  let body = document.getElementsByTagName("body")[0];
  body.innerHTML = "<img id=\"cross\" src=\"./cross.svg\" alt=\"cross\" />";

  let frame = document.createElement("iframe");
  frame.src = "./drag.html";
  frame.style.width = "100%";
  frame.style.height = "100%";
  frame.style.border = "none";
  frame.style.position = "absolute";
  frame.style.top = "0";
  frame.style.left = "0";
  document.body.appendChild(frame);
}

function reloadPage() {
  location.reload();
}

function reloadPageAndCreateDragFrame() {
  location.reload();
  createDragFrame();
}
