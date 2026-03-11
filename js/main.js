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


/* ============================================================
   Map — أقرب مركز إسعاف
   ============================================================ */
(function () {
    function initMap() {
        const mapContainer = document.getElementById("nc-map");
        if (!mapContainer) return;

        const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhjYjAwZmRkZGE3OTQyZWY5NDI3M2I2Y2YxNzk0ODA4IiwiaCI6Im11cm11cjY0In0=";

        const map = L.map("nc-map").setView([30.0444, 31.2357], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);

        let userMarker     = null;
        let hospitalMarker = null;
        let routeLayer     = null;

        const findBtn   = document.getElementById("findNearest");
        const statusBox = document.getElementById("mapStatus");
        const infoBox   = document.getElementById("hospitalInfo");
        const infoName  = document.getElementById("hospitalName");
        const infoDist  = document.getElementById("hospitalDist");
        const infoLink  = document.getElementById("hospitalLink");

        const hospitalIcon = L.divIcon({
            className  : "",
            html       : '<div style="font-size:30px;line-height:1;filter:drop-shadow(0 2px 5px rgba(0,0,0,.4))">🏥</div>',
            iconSize   : [34, 34],
            iconAnchor : [17, 34],
            popupAnchor: [0, -36]
        });

        function showStatus(msg, type) {
            if (!statusBox) return;
            statusBox.textContent = msg;
            statusBox.className   = "map-status " + type;
        }

        function showInfo(name, distKm, minutes, userLat, userLon, hosLat, hosLon) {
            if (!infoBox) return;
            if (infoName) infoName.textContent = "🏥 " + name;
            if (infoDist) infoDist.innerHTML   =
                "🛣️ " + distKm + " كم &nbsp;|&nbsp; ⏱️ " + minutes + " دقيقة تقريباً";
            if (infoLink) {
                infoLink.href   = "https://www.google.com/maps/dir/" +
                                  userLat + "," + userLon + "/" +
                                  hosLat  + "," + hosLon;
                infoLink.target = "_blank";
            }
            infoBox.classList.add("visible");
        }

        async function drawRoute(startLon, startLat, endLon, endLat) {
            const res = await fetch(
                "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
                {
                    method : "POST",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization": ORS_KEY
                    },
                    body: JSON.stringify({
                        coordinates: [[startLon, startLat], [endLon, endLat]]
                    })
                }
            );
            if (!res.ok) throw new Error("ORS " + res.status);
            const data = await res.json();

            if (routeLayer) map.removeLayer(routeLayer);
            routeLayer = L.geoJSON(data, {
                style: { color: "#650101", weight: 5, opacity: 0.85, dashArray: "8, 4" }
            }).addTo(map);
            map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

            const seg     = data.features[0].properties.segments[0];
            const distKm  = (seg.distance / 1000).toFixed(1);
            const minutes = Math.ceil(seg.duration / 60);
            return { distKm, minutes };
        }

        if (!findBtn) return;

        findBtn.addEventListener("click", function () {
            if (!navigator.geolocation) {
                showStatus("❌ المتصفح لا يدعم تحديد الموقع", "error");
                return;
            }
            findBtn.disabled = true;
            if (infoBox)    infoBox.classList.remove("visible");
            if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
            showStatus("⏳ جاري تحديد موقعك…", "loading");

            navigator.geolocation.getCurrentPosition(
                async function (pos) {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;

                    if (userMarker) map.removeLayer(userMarker);
                    userMarker = L.marker([lat, lon])
                        .addTo(map).bindPopup("📍 موقعك الحالي").openPopup();
                    map.setView([lat, lon], 14);

                    showStatus("🔍 جاري البحث عن أقرب مستشفى…", "loading");

                    const query = '[out:json];(node["amenity"~"hospital|clinic"](around:5000,' +
                                  lat + ',' + lon + '););out body;';
                    try {
                        const r1   = await fetch("https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query));
                        const data = await r1.json();

                        if (data.elements && data.elements.length > 0) {
                            const nearest = data.elements[0];
                            const name    = (nearest.tags &&
                                            (nearest.tags["name:ar"] || nearest.tags["name"]))
                                            || "مستشفى / عيادة قريبة";

                            if (hospitalMarker) map.removeLayer(hospitalMarker);
                            hospitalMarker = L.marker([nearest.lat, nearest.lon], { icon: hospitalIcon })
                                .addTo(map).bindPopup("<b>" + name + "</b>").openPopup();

                            showStatus("🗺️ جاري رسم المسار…", "loading");
                            const { distKm, minutes } = await drawRoute(lon, lat, nearest.lon, nearest.lat);

                            showStatus("✅ أقرب مستشفى على بُعد " + distKm + " كم (~" + minutes + " دقيقة)", "success");
                            showInfo(name, distKm, minutes, lat, lon, nearest.lat, nearest.lon);
                        } else {
                            showStatus("⚠️ لم يتم العثور على مستشفيات في نطاق 5 كم", "error");
                        }
                    } catch (e) {
                        console.error("Map/Route Error:", e);
                        showStatus("❌ حدث خطأ، حاول مرة أخرى", "error");
                    }
                    findBtn.disabled = false;
                },
                function () {
                    showStatus("❌ تعذّر تحديد موقعك، تأكد من السماح بالوصول للموقع", "error");
                    findBtn.disabled = false;
                }
            );
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMap);
    } else {
        initMap();
    }
})();


/* ============================================================
   Slider — اعرف خطاك
   ============================================================ */
(function () {
    function initSlider() {
        const slider  = document.querySelector(".slider");
        const slides  = document.querySelectorAll(".slide");
        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        if (!slider || slides.length === 0) return;

        let sliderIndex = 0;

        function updateSlider() {
            slider.style.transform = "translateX(-" + (sliderIndex * 100) + "%)";
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                sliderIndex = (sliderIndex + 1) % slides.length;
                updateSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                sliderIndex = (sliderIndex - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }

        updateSlider();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSlider);
    } else {
        initSlider();
    }
})();


/* ============================================================
   Testimonials — آراء العملاء
   ============================================================ */
(function () {
    function initTestimonials() {
        const testimonials = [
            "الدورات التعليمية بسيطة ومفهومة، وحسّستني إني أقدر أساعد غيري وقت الحاجة",
            "الموقع ساعدني أفهم أتصرف إزاي في موقف طارئ بهدوء، والمعلومات كانت واضحة وسهلة",
            "فكرة الموقع ممتازة وبتجمع كل المعلومات المهمة في مكان واحد بشكل منظم"
        ];

        const avatars = document.querySelectorAll(".avatar");
        const message = document.getElementById("testimonialMessage");
        const nextBtn = document.getElementById("next");
        const prevBtn = document.getElementById("prev");

        if (!message || !nextBtn || !prevBtn || avatars.length === 0) return;

        let testimonialIndex = 0;

        function updateTestimonial(i) {
            avatars.forEach(function (a) { a.classList.remove("active"); });
            avatars[i].classList.add("active");
            message.textContent = testimonials[i];
        }

        nextBtn.addEventListener("click", function () {
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            updateTestimonial(testimonialIndex);
        });

        prevBtn.addEventListener("click", function () {
            testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonial(testimonialIndex);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTestimonials);
    } else {
        initTestimonials();
    }
})();


/* ============================================================
   AI Bot Button
   ============================================================ */
(function () {
    function initAiBot() {
        var btn = document.querySelector(".ai-bot");
        if (!btn) return;
        btn.addEventListener("click", function () {
            window.location.href = "chat-ai-main/index.html";
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAiBot);
    } else {
        initAiBot();
    }
})();
