const canvas = document.getElementById('lienzo');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.overflowX = 'hidden';

const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 50;
const gap = 30;

ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.strokeStyle = 'black';
ctx.lineWidth = 15;
ctx.stroke();
ctx.closePath();

const length = 100;
for (let j = 0; j < 8; j++) {
    const angle2 = (Math.PI * 2 / 4) * j;
    const startX1 = centerX + Math.cos(angle2) * (radius + gap);
    const startY = centerY + Math.sin(angle2) * (radius + gap);
    const endX = centerX + Math.cos(angle2) * (radius + gap + length);
    const endY = centerY + Math.sin(angle2) * (radius + gap + length);
}
    const length2 = 75;
for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 4) * i;
    const startX = centerX + Math.cos(angle) * (radius + gap);
    const startY = centerY + Math.sin(angle) * (radius + gap);
    const endX = centerX + Math.cos(angle) * (radius + gap + length2);
    const endY = centerY + Math.sin(angle) * (radius + gap + length2);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.closePath();
}