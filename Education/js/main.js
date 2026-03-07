
 /*start nav*/ 
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
/*end nav*/
function normalizeArabic(text){
return text
.toLowerCase()
.replace(/[أإآ]/g,"ا")
.replace(/ة/g,"ه")
.replace(/ى/g,"ي")
.replace(/ئ/g,"ي")
.replace(/ؤ/g,"و");
}
const searchIcon = document.querySelector(".search-box i");
const searchInput1 = document.getElementById("searchInput");

searchIcon.addEventListener("click", function () {
    searchInput.focus();
});
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function(){

let value = normalizeArabic(this.value);

let cards = document.querySelectorAll(".video-card");

cards.forEach(card=>{

let title = normalizeArabic(
card.querySelector(".video-title").textContent
);

if(title.includes(value)){
card.style.display="block";
}else{
card.style.display="none";
}

});

});
document.addEventListener('play', function(e){
   
    const allVideos = document.querySelectorAll('video');
    
    for(let i = 0; i < allVideos.length; i++){
        
        if(allVideos[i] != e.target){
            allVideos[i].pause();
         
        }
    }
}, true); 