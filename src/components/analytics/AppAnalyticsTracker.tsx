"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useActivePath } from "@/contexts/ActivePathContext";
import { trackUserAnalyticsEvent } from "@/lib/analytics/user-analytics";

const AUDIO_COMPLETION_THRESHOLD_PERCENT = 95;
const MAX_PROGRESS_DELTA_SECONDS = 10;
const MAX_TRACKED_SECONDS_PER_SESSION = 4 * 60 * 60;

type AudioContext = {
  pathId: string | null;
  pathTitle: string | null;
  moduleId: string | null;
  moduleTitle: string | null;
  weekNumber: number | null;
  routeCode: string | null;
};

type AudioSessionState = {
  sessionId: string;
  startedAtIso: string;
  audioUrl: string;
  context: AudioContext;
  listenSeconds: number;
  lastProgressAtMs: number | null;
  lastKnownPositionSec: number | null;
  durationSec: number | null;
  pendingSeekFromSec: number | null;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function round(value: number | null, decimals = 2): number | null {
  if (!isFiniteNumber(value)) {
    return null;
  }
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function extractWeekNumberFromText(value?: string | null): number | null {
  if (!value) {
    return null;
  }
  const matches = value.match(/(?:sem(?:ana)?|week)[_-]?(\d+)/i);
  if (!matches) {
    return null;
  }
  const parsed = Number.parseInt(matches[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractWeekNumberFromAudioUrl(audioUrl: string): number | null {
  const matches = audioUrl.match(/semana[_-]?(\d+)/i) ?? audioUrl.match(/sem(\d+)/i);
  if (!matches) {
    return null;
  }
  const parsed = Number.parseInt(matches[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractRouteCodeFromAudioUrl(audioUrl: string): string | null {
  const matches = audioUrl.match(/\/(ruta\d+)\//i);
  return matches ? matches[1].toLowerCase() : null;
}

function buildAudioId(audioUrl: string): string {
  try {
    const parsed = new URL(audioUrl);
    const fileName = parsed.pathname.split("/").pop() ?? "audio";
    return fileName.replace(/\.[^.]+$/, "").toLowerCase() || "audio";
  } catch {
    const sanitized = audioUrl.split("?")[0].split("#")[0];
    const fileName = sanitized.split("/").pop() ?? "audio";
    return fileName.replace(/\.[^.]+$/, "").toLowerCase() || "audio";
  }
}

function getAudioSource(audio: HTMLAudioElement): string | null {
  const source = audio.currentSrc || audio.src || audio.getAttribute("src");
  if (!source) {
    return null;
  }

  try {
    return new URL(source, window.location.origin).toString();
  } catch {
    return source;
  }
}

function getAudioContext(
  audio: HTMLAudioElement,
  audioUrl: string,
  pathname: string,
  activePath: { id: string; title: string } | null
): AudioContext {
  const contextElement = audio.closest<HTMLElement>("[data-analytics-context]");
  const pathId = contextElement?.dataset.analyticsPathId ?? activePath?.id ?? null;
  const pathTitle = contextElement?.dataset.analyticsPathTitle ?? activePath?.title ?? null;
  const moduleId = contextElement?.dataset.analyticsModuleId ?? null;
  const moduleTitle = contextElement?.dataset.analyticsModuleTitle ?? null;
  const weekFromDataset = contextElement?.dataset.analyticsWeekNumber
    ? Number.parseInt(contextElement.dataset.analyticsWeekNumber, 10)
    : null;
  const normalizedWeekFromDataset = Number.isFinite(weekFromDataset) ? weekFromDataset : null;
  const weekNumber =
    normalizedWeekFromDataset ??
    extractWeekNumberFromText(moduleId) ??
    extractWeekNumberFromText(moduleTitle) ??
    extractWeekNumberFromAudioUrl(audioUrl);

  const routeCode = extractRouteCodeFromAudioUrl(audioUrl);

  if (!pathId && pathname.startsWith("/paths/")) {
    const fallbackPathId = pathname.split("/")[2] || null;
    return {
      pathId: fallbackPathId,
      pathTitle,
      moduleId,
      moduleTitle,
      weekNumber,
      routeCode,
    };
  }

  return {
    pathId,
    pathTitle,
    moduleId,
    moduleTitle,
    weekNumber,
    routeCode,
  };
}

function getAudioTarget(event: Event): HTMLAudioElement | null {
  return event.target instanceof HTMLAudioElement ? event.target : null;
}

export function AppAnalyticsTracker() {
  const { user } = useUser();
  const { activePath } = useActivePath();
  const pathname = usePathname();

  const userIdRef = useRef<string | null>(null);
  const pathnameRef = useRef<string>("/");
  const activePathRef = useRef<{ id: string; title: string } | null>(null);
  const audioSessionsRef = useRef<Map<HTMLAudioElement, AudioSessionState>>(new Map());

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    activePathRef.current = activePath
      ? { id: activePath.id, title: activePath.title }
      : null;
  }, [activePath]);

  useEffect(() => {
    const sessions = audioSessionsRef.current;

    const emitAudioEvent = (eventName: string, payload: Record<string, unknown>) => {
      trackUserAnalyticsEvent({
        userId: userIdRef.current,
        category: "audio",
        eventName,
        payload: {
          pagePath: pathnameRef.current,
          ...payload,
        },
      });
    };

    const updateListeningProgress = (audio: HTMLAudioElement, session: AudioSessionState) => {
      if (!session.lastProgressAtMs) {
        session.lastProgressAtMs = performance.now();
        return;
      }

      const now = performance.now();
      const deltaSeconds = (now - session.lastProgressAtMs) / 1000;
      session.lastProgressAtMs = now;

      if (deltaSeconds <= 0 || deltaSeconds > MAX_PROGRESS_DELTA_SECONDS) {
        return;
      }

      session.listenSeconds = Math.min(
        session.listenSeconds + deltaSeconds,
        MAX_TRACKED_SECONDS_PER_SESSION
      );
      session.lastKnownPositionSec = isFiniteNumber(audio.currentTime) ? audio.currentTime : session.lastKnownPositionSec;
      session.durationSec = isFiniteNumber(audio.duration) ? audio.duration : session.durationSec;
    };

    const closeSession = (audio: HTMLAudioElement, eventName: string, reason: string) => {
      const session = sessions.get(audio);
      if (!session) {
        return;
      }

      updateListeningProgress(audio, session);

      const currentPositionSec = isFiniteNumber(audio.currentTime)
        ? audio.currentTime
        : session.lastKnownPositionSec;
      const durationSec = isFiniteNumber(audio.duration) ? audio.duration : session.durationSec;
      const completionPct =
        isFiniteNumber(durationSec) && durationSec > 0 && isFiniteNumber(currentPositionSec)
          ? Math.min((currentPositionSec / durationSec) * 100, 100)
          : null;

      emitAudioEvent(eventName, {
        reason,
        audioSessionId: session.sessionId,
        audioId: buildAudioId(session.audioUrl),
        audioUrl: session.audioUrl,
        listenSeconds: round(session.listenSeconds),
        currentPositionSec: round(currentPositionSec),
        durationSec: round(durationSec),
        completionPct: round(completionPct),
        listenedFull:
          isFiniteNumber(completionPct) && completionPct >= AUDIO_COMPLETION_THRESHOLD_PERCENT,
        startedAtIso: session.startedAtIso,
        endedAtIso: new Date().toISOString(),
        pathId: session.context.pathId,
        pathTitle: session.context.pathTitle,
        moduleId: session.context.moduleId,
        moduleTitle: session.context.moduleTitle,
        weekNumber: session.context.weekNumber,
        routeCode: session.context.routeCode,
        playbackRate: round(audio.playbackRate),
      });

      sessions.delete(audio);
    };

    const handlePlay = (event: Event) => {
      if (!userIdRef.current) {
        return;
      }

      const audio = getAudioTarget(event);
      if (!audio) {
        return;
      }

      const audioUrl = getAudioSource(audio);
      if (!audioUrl) {
        return;
      }

      const existingSession = sessions.get(audio);
      if (existingSession && existingSession.audioUrl !== audioUrl) {
        closeSession(audio, "audio_session_summary", "source_changed");
      }

      const sessionContext = getAudioContext(
        audio,
        audioUrl,
        pathnameRef.current,
        activePathRef.current
      );

      const session: AudioSessionState = {
        sessionId: crypto.randomUUID(),
        startedAtIso: new Date().toISOString(),
        audioUrl,
        context: sessionContext,
        listenSeconds: 0,
        lastProgressAtMs: performance.now(),
        lastKnownPositionSec: isFiniteNumber(audio.currentTime) ? audio.currentTime : null,
        durationSec: isFiniteNumber(audio.duration) ? audio.duration : null,
        pendingSeekFromSec: null,
      };
      sessions.set(audio, session);

      emitAudioEvent("audio_play", {
        audioSessionId: session.sessionId,
        audioId: buildAudioId(audioUrl),
        audioUrl,
        currentPositionSec: round(session.lastKnownPositionSec),
        durationSec: round(session.durationSec),
        pathId: sessionContext.pathId,
        pathTitle: sessionContext.pathTitle,
        moduleId: sessionContext.moduleId,
        moduleTitle: sessionContext.moduleTitle,
        weekNumber: sessionContext.weekNumber,
        routeCode: sessionContext.routeCode,
        playbackRate: round(audio.playbackRate),
      });
    };

    const handlePause = (event: Event) => {
      const audio = getAudioTarget(event);
      if (!audio || audio.ended) {
        return;
      }
      closeSession(audio, "audio_pause", "pause");
    };

    const handleEnded = (event: Event) => {
      const audio = getAudioTarget(event);
      if (!audio) {
        return;
      }
      closeSession(audio, "audio_end", "ended");
    };

    const handleTimeUpdate = (event: Event) => {
      const audio = getAudioTarget(event);
      if (!audio) {
        return;
      }
      const session = sessions.get(audio);
      if (!session) {
        return;
      }
      updateListeningProgress(audio, session);
    };

    const handleSeeking = (event: Event) => {
      const audio = getAudioTarget(event);
      if (!audio) {
        return;
      }
      const session = sessions.get(audio);
      if (!session) {
        return;
      }
      updateListeningProgress(audio, session);
      session.pendingSeekFromSec = session.lastKnownPositionSec;
    };

    const handleSeeked = (event: Event) => {
      const audio = getAudioTarget(event);
      if (!audio) {
        return;
      }
      const session = sessions.get(audio);
      if (!session) {
        return;
      }

      const toPositionSec = isFiniteNumber(audio.currentTime) ? audio.currentTime : null;

      emitAudioEvent("audio_seek", {
        audioSessionId: session.sessionId,
        audioId: buildAudioId(session.audioUrl),
        audioUrl: session.audioUrl,
        fromPositionSec: round(session.pendingSeekFromSec),
        toPositionSec: round(toPositionSec),
        pathId: session.context.pathId,
        moduleId: session.context.moduleId,
        weekNumber: session.context.weekNumber,
      });

      session.lastKnownPositionSec = toPositionSec;
      session.pendingSeekFromSec = null;
      session.lastProgressAtMs = performance.now();
    };

    const flushAllSessions = (reason: string) => {
      for (const [audio] of sessions.entries()) {
        closeSession(audio, "audio_session_summary", reason);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushAllSessions("visibility_hidden");
      }
    };

    const handlePageHide = () => {
      flushAllSessions("pagehide");
    };

    document.addEventListener("play", handlePlay, true);
    document.addEventListener("pause", handlePause, true);
    document.addEventListener("ended", handleEnded, true);
    document.addEventListener("timeupdate", handleTimeUpdate, true);
    document.addEventListener("seeking", handleSeeking, true);
    document.addEventListener("seeked", handleSeeked, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("play", handlePlay, true);
      document.removeEventListener("pause", handlePause, true);
      document.removeEventListener("ended", handleEnded, true);
      document.removeEventListener("timeupdate", handleTimeUpdate, true);
      document.removeEventListener("seeking", handleSeeking, true);
      document.removeEventListener("seeked", handleSeeked, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      flushAllSessions("component_unmount");
    };
  }, []);

  return null;
}




