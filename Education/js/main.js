/* ============================================================
   Navbar
   ============================================================ */
(function () {
    function initNavbar() {
        const menu     = document.getElementById("navMenu");
        const overlay  = document.querySelector(".overlay");
        const menuIcon = document.querySelector(".menu-icon");

        if (!menu) return;

        window.toggleMenu = function () {
            menu.classList.toggle("show");
            if (overlay) overlay.classList.toggle("show");
        };

        document.addEventListener("click", function (event) {
            if (menu.classList.contains("show")) {
                const isClickInsideMenu = menu.contains(event.target);
                const isClickOnIcon    = menuIcon && menuIcon.contains(event.target);
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


(function () {
    function setNavH() {
        var navbar = document.querySelector(".navbar");
        if (!navbar) return;
        var h = navbar.getBoundingClientRect().height;
        document.documentElement.style.setProperty("--navbar-h", h + "px");
    }

    function init() {
        setNavH();
        if (window.ResizeObserver) {
            var navbar = document.querySelector(".navbar");
            if (navbar) new ResizeObserver(setNavH).observe(navbar);
        }
        window.addEventListener("resize", setNavH);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();



(function () {
    function initSearch() {
        const searchInput = document.getElementById("searchInput");
        const searchIcon  = document.querySelector(".search-box i");

        if (!searchInput) return;

  
        if (searchIcon) {
            searchIcon.addEventListener("click", function () {
                searchInput.focus();
            });
        }

        function normalizeArabic(text) {
            return text
                .toLowerCase()
                .replace(/[أإآ]/g, "ا")
                .replace(/ة/g,     "ه")
                .replace(/ى/g,     "ي")
                .replace(/ئ/g,     "ي")
                .replace(/ؤ/g,     "و");
        }

        searchInput.addEventListener("keyup", function () {
            var value = normalizeArabic(this.value.trim());
            var cards = document.querySelectorAll(".video-card");

            cards.forEach(function (card) {
                var titleEl = card.querySelector(".video-title");
                if (!titleEl) return;
                var title = normalizeArabic(titleEl.textContent);
                card.style.display = (value === "" || title.includes(value)) ? "flex" : "none";
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSearch);
    } else {
        initSearch();
    }
})();



document.addEventListener("play", function (e) {
    var allVideos = document.querySelectorAll("video");
    allVideos.forEach(function (video) {
        if (video !== e.target) video.pause();
    });
}, true);
