self.addEventListener("install", (event) => {
	self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
	// Let browser handle non-GET and cross-origin requests normally.
	if (event.request.method !== "GET") return;
	const requestUrl = new URL(event.request.url);
	if (requestUrl.origin !== self.location.origin) return;

	event.respondWith(
		fetch(event.request).catch(async () => {
			const cache = await caches.open("offline-fallback-v1");
			const cached = await cache.match(event.request);
			if (cached) return cached;
			return new Response("Offline", {
				status: 503,
				statusText: "Service Unavailable",
			});
		}),
	);
});

self.addEventListener("activate", (event) => {
	self.clients.claim();
});
