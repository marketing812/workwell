const YOUTUBE_VIDEO_ID = "riFTSyQWv84";
const APP_ORIGIN = "https://emotiva--workwell-c4rlk.europe-west4.hosted.app";

export default function WelcomeVideoEmbedPage() {
  const src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(APP_ORIGIN)}&widget_referrer=${encodeURIComponent(APP_ORIGIN)}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="relative h-screen w-screen overflow-hidden bg-black">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={src}
          title="Video de bienvenida EMOTIVA"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </main>
  );
}
