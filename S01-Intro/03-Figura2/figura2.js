const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.overflowX = 'hidden';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const cols = 1;
const rows = 11;

// Make circles bigger
const radius = Math.min(canvas.width, canvas.height) / 6;

const gap = radius * 0.2;

const centerX = canvas.width / 2;

const startY = (canvas.height - (rows * radius *0.2 + (rows - 1) * gap)) / 2 + radius;

ctx.strokeStyle = 'white';
ctx.lineWidth = 3;

for (let row = 0; row < rows; row++) {
    const y = startY + row * (gap);
    ctx.beginPath();
    ctx.arc(centerX, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}