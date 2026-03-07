
const counters = document.querySelectorAll('.num1');
counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target')
        const count = +counter.innerText.replace('%', '').replace('+', '');
        const increment = target / 90;
        if (count < target) {
            const nextValue = Math.ceil(count + increment);
            if (target === 123) {
                counter.innerText = nextValue + "+";
            } else {
                counter.innerText = nextValue + "%";
            }
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = (target === 123) ? target + "+" : target + "%";
        }
    };
    updateCount();
});
(function() { 
    function initNavbar() { 
        const menu = document.getElementById("navMenu"); 
        const overlay = document.querySelector(".overlay"); 
        const menuIcon = document.querySelector(".menu-icon"); 
 
        if (!menu) return; 
        window.toggleMenu = function() { 
            menu.classList.toggle("show"); 
            if (overlay) overlay.classList.toggle("show"); 
        }; 
         
        document.addEventListener("click", function(event) { 
            if (menu.classList.contains("show")) { 
                const isClickInsideMenu = menu.contains(event.target); 
                const isClickOnIcon = menuIcon && menuIcon.contains(event.target); 
                 
                if (!isClickInsideMenu && !isClickOnIcon) { 
                    menu.classList.remove("show"); 
                    if (overlay) overlay.classList.remove("show"); 
                } 
            } 
        }); 
    } 
 
    if (document.readyState === "loading") { 
        document.addEventListener("DOMContentLoaded", initNavbar); 
    } else { 
        initNavbar(); 
    } 
})();