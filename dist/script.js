(() => {
  const abilities = {
    dash: ['1', 'Dash', 'Select a burst of movement to cross a gap. The ESP32 sends the same number key you can press on a keyboard.'],
    wall: ['2', 'Wall jump', 'Select wall jumping to push away from a wall. A physical token chooses the ability; your movement and jump inputs do the rest.'],
    gravity: ['3', 'Gravity flip', 'Select gravity inversion to turn the ceiling into a path. Scan the token, then activate the ability in the game.'],
    time: ['4', 'Time stop', 'Select time stop to create a short window to move through the level. The token selects the ability rather than replacing every control.']
  };
  const tokens = document.querySelectorAll('[data-ability]');
  tokens.forEach(button => button.addEventListener('click', () => {
    const [key, title, description] = abilities[button.dataset.ability];
    tokens.forEach(token => token.setAttribute('aria-pressed', String(token === button)));
    document.getElementById('token-key').textContent = `BLUETOOTH INPUT / KEY ${key}`;
    document.getElementById('token-title').textContent = title;
    document.getElementById('token-description').textContent = description;
  }));
  document.querySelector('a[href="#rfid-system"]')?.addEventListener('click', () => {
    document.getElementById('rfid-system').open = true;
  });
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  try {
    Promise.resolve(context.registerTool({
      name: 'inspect_rfid_system',
      description: 'Open the RFID platformer system explanation on this portfolio.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('Expected an empty object.');
        const panel = document.getElementById('rfid-system');
        panel.open = true;
        panel.scrollIntoView({ block: 'start' });
        return { open: true, system: 'RFID token → reader and ESP32 → Bluetooth keyboard input → Unity ability' };
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch (_) { /* Optional browser capability. Native disclosure remains available. */ }
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
})();
