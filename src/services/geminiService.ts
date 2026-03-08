// Frontend service — calls our serverless backend, NOT Gemini directly.
// No API keys in the browser.

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Send a message to Gérard via /api/chat (SSE streaming).
 * Returns an async iterable of { text } chunks, matching the old Gemini SDK interface.
 */
export async function sendMessageToGerard(
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
) {
  const trimmed = message.slice(0, MAX_MESSAGE_LENGTH);

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: trimmed, history }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erreur serveur' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();

  // Return an async iterable that yields { text } chunks (same shape App.tsx expects)
  return {
    [Symbol.asyncIterator]() {
      let buffer = '';
      return {
        async next(): Promise<IteratorResult<{ text: string }>> {
          while (true) {
            // Check buffer for complete SSE messages
            const lineEnd = buffer.indexOf('\n\n');
            if (lineEnd !== -1) {
              const line = buffer.slice(0, lineEnd);
              buffer = buffer.slice(lineEnd + 2);

              if (line.startsWith('data: ')) {
                const payload = line.slice(6);
                if (payload === '[DONE]') {
                  return { done: true, value: undefined as any };
                }
                try {
                  return { done: false, value: JSON.parse(payload) };
                } catch {
                  continue;
                }
              }
              continue;
            }

            // Read more from stream
            const { done, value } = await reader.read();
            if (done) {
              return { done: true, value: undefined as any };
            }
            buffer += decoder.decode(value, { stream: true });
          }
        },
      };
    },
  };
}

/**
 * Generate speech for Gérard via /api/tts.
 * Returns { data, mimeType } or undefined.
 */
export async function generateSpeechForGerard(text: string) {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.slice(0, 5000) }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erreur serveur' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return await response.json();
}
