(() => {
  const words = 'а|и|но|да|либо|или|в|во|на|к|ко|с|со|о|об|обо|у|за|из|из-за|из-под|от|до|по|для|без|при|про|над|под|перед|через|между|после|около|не|ни';
  const boundary = '(?<![\\p{L}\\p{N}_])(?:' + words + ')';
  const shortWords = new RegExp(boundary + '[ \\t\\r\\n]+(?=[\\p{L}\\p{N}«„"\'(])', 'giu');
  const trailingShortWord = new RegExp(boundary + '[ \\t\\r\\n]+$', 'iu');
  const excluded = 'script,style,noscript,pre,code,kbd,samp,textarea,svg,math,[contenteditable]:not([contenteditable="false"]),[data-typography="off"]';
  const formatText = node => {
    if (!node.parentElement || node.parentElement.closest(excluded)) return;
    let next = node.data.replace(shortWords, match => match.trimEnd() + '\u00a0');
    const sibling = node.nextSibling;
    if (trailingShortWord.test(next) && sibling?.nodeType === Node.ELEMENT_NODE &&
        !sibling.matches('br,' + excluded) && /^[\p{L}\p{N}«„"'(]/u.test(sibling.textContent.trimStart()) &&
        getComputedStyle(sibling).display.startsWith('inline')) {
      next = next.replace(trailingShortWord, match => match.trimEnd() + '\u00a0');
    }
    if (next !== node.data) node.data = next;
  };
  const format = root => {
    if (root.nodeType === Node.TEXT_NODE) return formatText(root);
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches(excluded)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) formatText(walker.currentNode);
  };
  const start = () => {
    format(document.body);
    // Prices, menus and other dynamically rendered copy need the same typography.
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') formatText(record.target);
        else record.addedNodes.forEach(format);
      }
    }).observe(document.body, { childList: true, characterData: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
