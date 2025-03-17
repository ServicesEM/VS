(function () {
    // 🔹 1. TRANSFERIR IMAGEN DE FONDO
    function transferBackgroundImage() {
        const observedNodes = new WeakSet();

        function applyBackground(targetElement) {
            const bgImageStyle = targetElement.style.backgroundImage;
            const headlineElement = document.querySelector('.DPAHeadline');
            if (bgImageStyle && headlineElement) {
                headlineElement.style.backgroundImage = bgImageStyle;
                return true;
            }
            return false;
        }

        const existingElement = document.querySelector('.bg-center.bg-cover.bg-no-repeat');
        if (existingElement && applyBackground(existingElement)) return;

        const observer = new MutationObserver((mutations, obs) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && !observedNodes.has(node)) {
                        observedNodes.add(node);
                        const targetElement = node.matches('.bg-center.bg-cover.bg-no-repeat') 
                                              ? node 
                                              : node.querySelector('.bg-center.bg-cover.bg-no-repeat');
                        if (targetElement && applyBackground(targetElement)) {
                            obs.disconnect();
                        }
                    }
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 🔹 2. ACTIVAR CLICK EN HEADLINE
    function enableHeadlineClick() {
        document.addEventListener('click', e => {
            if (e.target.closest('p[data-test="headline-subtitle"]')) {
                const el = document.querySelector('.DPAHeadline.w-full.max-w-full div[data-em-cmp="dpa_headline"] h1 span');
                if (el) el.click();
            }
        });
    }

    // 🔹 3. OBSERVADOR PARA CAROUSEL
    function observeCarousels() {
        const observedElements = new WeakSet();
        const classMap = {
            "Upper Class": "uperclass",
            "Premium": "premiumclass",
            "Economy": "economyclass"
        };

        function updateCarouselClass(carouselElement) {
            if (!observedElements.has(carouselElement)) {
                observedElements.add(carouselElement);
            }

            if (carouselElement.querySelector('div[data-test="redemption-amount"]')) {
                carouselElement.className = carouselElement.className.replace(/\b(uperclass|premiumclass|economyclass)\b/g, '');
                return;
            }

            const travelClassElement = carouselElement.querySelector('div[data-test="travel-class"]');
            if (travelClassElement) {
                const travelClass = travelClassElement.textContent.trim();
                carouselElement.className = carouselElement.className.replace(/\b(uperclass|premiumclass|economyclass)\b/g, '');
                if (classMap[travelClass]) {
                    carouselElement.classList.add(classMap[travelClass]);
                }
            }
        }

        function observeCarouselChanges(carouselElement) {
            const internalObserver = new MutationObserver(() => updateCarouselClass(carouselElement));
            internalObserver.observe(carouselElement, { childList: true, subtree: true });
        }

        function processElement(carouselElement) {
            updateCarouselClass(carouselElement);
            observeCarouselChanges(carouselElement);
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('div[data-em-sfm-type="CAROUSEL"]')) {
                            processElement(node);
                        } else {
                            const carouselElement = node.querySelector('div[data-em-sfm-type="CAROUSEL"]');
                            if (carouselElement) {
                                processElement(carouselElement);
                            }
                        }
                    }
                });
            });
        });

        document.querySelectorAll('div[data-em-sfm-type="CAROUSEL"]').forEach(processElement);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 🔹 4. INICIALIZAR TODAS LAS FUNCIONES AUTOMÁTICAMENTE
    function initLibrary() {
        transferBackgroundImage();
        enableHeadlineClick();
        observeCarousels();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initLibrary();
    } else {
        document.addEventListener("DOMContentLoaded", initLibrary);
    }

})();
