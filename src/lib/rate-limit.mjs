// Pembatas kecepatan sederhana (in-memory). Cocok untuk 1 container/server.
// Data hilang saat aplikasi restart, dan itu tidak masalah untuk anti-spam.

const buckets = new Map();
const MAX_TRACKED_KEYS = 5000;

function prune(now) {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
  // Jaga memori: kalau masih terlalu banyak, kosongkan semuanya.
  if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();
}

export function checkRateLimit(key, { limit, windowMs }, now = Date.now()) {
  if (buckets.size > MAX_TRACKED_KEYS) prune(now);

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// Ambil IP pengunjung dari header reverse proxy (Nginx/Caddy).
// Dipakai entri paling kanan karena itu yang ditambahkan proxy kita sendiri,
// sehingga tidak bisa dipalsukan oleh pengunjung.
export function getClientIp(headerList) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export function resetRateLimits() {
  buckets.clear();
}