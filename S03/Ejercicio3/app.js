console.log("S03. Ejercicio 03.")
console.log(gsap);

window.addEventListener("mousedown", function(){
    gsap.to(
        ".rectangulo",
        {
            x: 500,
            y: 795,
            duration: 4,
            ease: "bounce.in",
            onComplete: function(){
                gsap.to(
                    ".rectangulo",
                    {
                        y: 0,
                        x: 1000,
                        duration: 4,
                        ease: "bounce.out",
                    }
                )
            }
        }
    );
})