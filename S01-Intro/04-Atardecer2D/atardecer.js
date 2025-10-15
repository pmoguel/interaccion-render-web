// atardecer.js

let tl = gsap.timeline({ paused: true });

gsap.set(".sol", { 
    x: -100, 
    y: innerHeight + 50 
});

window.addEventListener("mousedown", function () {
    if (!tl.isActive()) {
        tl.restart();
    }
});

tl.to(".sol", {
    duration: 5, 
    x: innerWidth + 50, 
    ease: "none"
}, 0); 

tl.to(".sol", {
    duration: 2.5, 
    y: innerHeight * 0.4, 
    ease: "power1.out"
}, 0)
.to(".sol", {
    duration: 2.5, 
    y: innerHeight + 100, 
    ease: "power2.in" 
}, 2.5);

tl.to("#lienzo", {
    duration: 5, 
    backgroundColor: "#FF8C00", 
    ease: "linear",
    onComplete: () => {
         gsap.to("#lienzo", {
            duration: 1, 
            backgroundColor: "#000000",
            ease: "power2.in"
         });
    }
}, 0);