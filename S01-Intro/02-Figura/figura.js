const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.overflowX = 'hidden';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const cols = 3;
const rows = 2;

const maxRadiusX = canvas.width / (cols * 2);
const maxRadiusY = canvas.height / (rows * 2);
const radius = Math.min(maxRadiusX, maxRadiusY) * 0.9;

const gapX = (canvas.width - cols * radius * 2) / (cols + 1);
const gapY = (canvas.height - rows * radius * 2) / (rows + 1);

ctx.fillStyle = 'white';

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const x = gapX + radius + col * (2 * radius + gapX);
        const y = gapY + radius + row * (2 * radius + gapY);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

const rectWidth = 537;
const rectHeight = 236;
const rectX = canvas.width / 2;
const rectY = canvas.height / 2;

ctx.fillStyle = 'black';
ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

const rect2Width = 537;
const rect2Height = 236;
const rect2X = canvas.width / 2 - 536;
const rect2Y = canvas.height / 2 - 236;

ctx.fillStyle = 'black';
ctx.fillRect(rect2X, rect2Y, rect2Width, rect2Height);

const rect3Width = 250;
const rect3Height = 250;
const rect3X = 1391;
const rect3Y = canvas.height / 2 - 236;

ctx.fillStyle = 'black';
ctx.fillRect(rect3X, rect3Y, rect3Width, rect3Height);

const rect4Width = 250;
const rect4Height = 236;
const rect4X = 66;
const rect4Y = canvas.height / 2;

ctx.fillStyle = 'black';
ctx.fillRect(rect4X, rect4Y, rect4Width, rect4Height);
