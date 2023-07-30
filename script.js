const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const ctx = canvas.getContext('2d');
let size = 10;
let isPressed = false;
colorEl.value = 'black';
let color = colorEl.value;
let x;
let y;

canvas.addEventListener('mousedown', (e) => {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;
});

document.addEventListener('mouseup', (e) => {
  isPressed = false;
  x = undefined;
  y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);
    x = x2;
    y = y2;
  }
});

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
}

function updateSizeOnScreen() {
  sizeEL.innerText = size;
}

increaseBtn.addEventListener('click', () => {
  size += 5;
  if (size > 50) {
    size = 50;
  }
  updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
  size -= 5;
  if (size < 5) {
    size = 5;
  }
  updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => (color = e.target.value));

clearEl.addEventListener('click', () =>
  ctx.clearRect(0, 0, canvas.width, canvas.height)
);

//Save
let savedDrawings = [];
saveBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL();
  savedDrawings.push(dataUrl);
  updateSavedDrawings();
  saveDrawingsToLocalStorage();
  alert("success","Drawing saved succefully")
});

function updateSavedDrawings() {
  const displayElement = document.getElementById('display');
  let item = -1;
  let newDisplay = "";
  savedDrawings.forEach((drawing) => {
    item += 1;
    newDisplay += ` 
    <div>
        <img src="${drawing}" name="">
        <div>
            <button onclick="downloadItem(${item})" class="download">⇩</button>
            <button ondblclick="deleteItem(${item})" class="delete">X</button>
        </div>
    </div>    
    `
  });
  displayElement.innerHTML = newDisplay;
}
//Delete All
document.getElementById("deleteAll").addEventListener("dblclick",() =>{
  savedDrawings = [];
  updateSavedDrawings();
  saveDrawingsToLocalStorage();
  alert("success","All drawings deleted succefully")
});
//Delete
function deleteItem(item){
    if (item >= 0 && item < savedDrawings.length) {
        savedDrawings.splice(item, 1);
      }
    updateSavedDrawings();
    saveDrawingsToLocalStorage();
}
//Download
function downloadItem(item){
  const dataUrl = savedDrawings[item];
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = 'drawing.png';
  anchor.click();
}
// Save drawings to local storage
function saveDrawingsToLocalStorage() {
    localStorage.setItem('savedDrawings', JSON.stringify(savedDrawings));
  }
  
// Fetch drawings from local storage on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const storedDrawings = localStorage.getItem('savedDrawings');
    if (storedDrawings) {
      savedDrawings = JSON.parse(storedDrawings);
      updateSavedDrawings();
    }
});
//pop up message
function alert(type, displayMessage) {
  let message = document.getElementById('message');
  let Text;
  if (type === 'success') {
      Text = 'Success';
  }
  else {
      Text = 'Error!';
  }
  message.innerHTML = `<div class="alert" role="alert">
                          <div>
                          <strong>${Text}:</strong> ${displayMessage}
                          </div>
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                          <span aria-hidden="true">×</span>
                          </button>
                      </div>`;
  setTimeout(function () {
      message.innerHTML = '';
  }, 5000);
}
  
  
  
  
  