(() => {
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
