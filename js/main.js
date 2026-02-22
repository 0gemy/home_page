
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


/* ============================================================
   ============================================================ */
(function() {
    function initMap() {
        const mapContainer = document.getElementById("nc-map");
        if (!mapContainer) return;

        let map = L.map('nc-map').setView([30.0444, 31.2357], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        let userMarker, hospitalMarker;
        const findBtn = document.getElementById("findNearest");

        if (findBtn) {
            findBtn.addEventListener("click", async () => {
                if (!navigator.geolocation) return alert("المتصفح لا يدعم تحديد الموقع");

                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;

                    if (userMarker) map.removeLayer(userMarker);
                    userMarker = L.marker([lat, lon]).addTo(map).bindPopup("موقعك").openPopup();
                    map.setView([lat, lon], 14);

                    const query = `[out:json];(node["amenity"~"hospital|clinic"](around:5000,${lat},${lon}););out body;`;
                    try {
                        const res = await fetch("https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query));
                        const data = await res.json();
                        if (data.elements.length > 0) {
                            const nearest = data.elements[0];
                            if (hospitalMarker) map.removeLayer(hospitalMarker);
                            hospitalMarker = L.marker([nearest.lat, nearest.lon]).addTo(map).bindPopup("أقرب مركز إسعاف").openPopup();
                        }
                    } catch (e) { console.error("Map Error:", e); }
                });
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMap);
    } else {
        initMap();
    }
})();


/* ============================================================
   ============================================================ */
(function() {
    function initSlider() {
        const slider = document.querySelector(".slider");
        const slides = document.querySelectorAll(".slide");
        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        if (!slider || slides.length === 0) return;

        let index = 0;

        const update = () => {
        
            slider.style.transform = `translateX(-${index * 100}%)`;
        };

        if (nextBtn) nextBtn.addEventListener("click", () => {
            index = (index + 1) % slides.length;
            update();
        });

        if (prevBtn) prevBtn.addEventListener("click", () => {
            index = (index - 1 + slides.length) % slides.length;
            update();
        });
        
        
        update();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSlider);
    } else {
        initSlider();
    }
})();
//=======================================
const testimonials = [
  " الدورات التعليمية بسيطة ومفهومة، وحسّستني إني أقدر أساعد غيري وقت الحاجة ",
" الموقع ساعدني أفهم أتصرف إزاي في موقف طارئ بهدوء، والمعلومات كانت واضحة وسهلة",
  " فكرة الموقع ممتازة وبتجمع كل المعلومات المهمة في مكان واحد بشكل منظم "
];

const avatars = document.querySelectorAll(".avatar");
const message = document.getElementById("testimonialMessage");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let index = 0;

function updateTestimonial(i) {
  avatars.forEach(a => a.classList.remove("active"));
  avatars[i].classList.add("active");
  message.textContent = testimonials[i];
}

next.onclick = () => {
  index = (index + 1) % testimonials.length;
  updateTestimonial(index);
};

prev.onclick = () => {
  index = (index - 1 + testimonials.length) % testimonials.length;
  updateTestimonial(index);
};