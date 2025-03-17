(function() {
  const observedNodes = new WeakSet();

  function transferBackgroundImage(targetElement) {
    const bgImageStyle = targetElement.style.backgroundImage;
    const headlineElement = document.querySelector('.DPAHeadline');
    if (bgImageStyle && headlineElement) {
      headlineElement.style.backgroundImage = bgImageStyle;
      return true;
    }
    return false;
  }

  const existingElement = document.querySelector('.bg-center.bg-cover.bg-no-repeat');
  if (existingElement && transferBackgroundImage(existingElement)) return;

  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && !observedNodes.has(node)) {
          observedNodes.add(node);
          const targetElement = node.matches('.bg-center.bg-cover.bg-no-repeat') 
                                ? node 
                                : node.querySelector('.bg-center.bg-cover.bg-no-repeat');
          if (targetElement && transferBackgroundImage(targetElement)) {
            obs.disconnect();
          }
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
