// Announces a message through the live regions rendered by Layout.
export function announce(message, assertive = false) {
  const el = document.getElementById(assertive ? 'sr-announcer-assertive' : 'sr-announcer');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => {
    el.textContent = message;
  }, 100);
}
