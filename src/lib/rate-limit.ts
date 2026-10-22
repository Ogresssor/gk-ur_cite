import "server-only";

// Простое ограничение в памяти процесса: защищает от флуда с одного IP.
// Ключ — IP из x-real-ip платформы; без доверенного прокси перед приложением его можно подделать.
// На нескольких инстансах (Vercel, кластер) замените на Upstash Ratelimit или Redis.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}
