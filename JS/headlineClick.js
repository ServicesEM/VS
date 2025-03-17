document.addEventListener('click', e => {
  if (e.target.closest('p[data-test="headline-subtitle"]')) {
    const el = document.querySelector('.DPAHeadline.w-full.max-w-full div[data-em-cmp="dpa_headline"] h1 span');
    if (el) el.click();
  }
});
