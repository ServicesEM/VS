(function() {
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
})();
