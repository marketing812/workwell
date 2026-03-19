import type { Path, PathModule } from '@/data/paths/pathTypes';

export interface PathUnlockInfo {
  isUnlocked: boolean;
  previousPathTitle?: string;
}

export interface ModuleUnlockInfo {
  isUnlocked: boolean;
  reason?: string;
}

const SEQUENTIAL_PATHS_ENV_VAR = 'NEXT_PUBLIC_ENFORCE_SEQUENTIAL_PATHS';

function isSequentialPathAccessEnabled(): boolean {
  const rawValue = process.env.NEXT_PUBLIC_ENFORCE_SEQUENTIAL_PATHS?.trim().toLowerCase();
  if (!rawValue) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(rawValue)) {
    return false;
  }

  if (['true', '1', 'yes', 'on'].includes(rawValue)) {
    return true;
  }

  console.warn(
    `[pathAccess] Valor no reconocido en ${SEQUENTIAL_PATHS_ENV_VAR}="${rawValue}". Se usa el valor por defecto (true).`
  );
  return true;
}

function parseWeekNumber(module: PathModule): number | null {
  const fromId = module.id.match(/sem(?:ana)?[_\-\s]?(\d+)/i);
  if (fromId) {
    return Number.parseInt(fromId[1], 10);
  }

  const fromTitle = module.title.match(/semana\s+(\d+)/i);
  if (fromTitle) {
    return Number.parseInt(fromTitle[1], 10);
  }

  return null;
}

export function isPathFullyCompleted(path: Path, completedModules: Set<string>): boolean {
  return path.modules.every((module) => completedModules.has(module.id));
}

export function getPathUnlockInfo(
  pathId: string,
  paths: Path[],
  getCompletedForPath: (id: string) => Set<string>
): PathUnlockInfo {
  if (!isSequentialPathAccessEnabled()) {
    return { isUnlocked: true };
  }

  const pathIndex = paths.findIndex((path) => path.id === pathId);
  if (pathIndex <= 0) {
    return { isUnlocked: true };
  }

  const previousPath = paths[pathIndex - 1];
  const previousCompleted = getCompletedForPath(previousPath.id);
  const previousCompletedAll = isPathFullyCompleted(previousPath, previousCompleted);

  return {
    isUnlocked: previousCompletedAll,
    previousPathTitle: previousPath.title,
  };
}

export function getModuleUnlockMap(path: Path, completedModules: Set<string>): Map<string, ModuleUnlockInfo> {
  if (!isSequentialPathAccessEnabled()) {
    const unlockMap = new Map<string, ModuleUnlockInfo>();
    path.modules.forEach((module) => {
      unlockMap.set(module.id, { isUnlocked: true });
    });
    return unlockMap;
  }

  const unlockMap = new Map<string, ModuleUnlockInfo>();
  const weekModules = new Map<number, PathModule[]>();

  path.modules.forEach((module) => {
    const week = parseWeekNumber(module);
    if (!week) {
      return;
    }
    if (!weekModules.has(week)) {
      weekModules.set(week, []);
    }
    weekModules.get(week)?.push(module);
  });

  const weekNumbers = Array.from(weekModules.keys()).sort((a, b) => a - b);
  const highestWeek = weekNumbers.length > 0 ? weekNumbers[weekNumbers.length - 1] : null;

  path.modules.forEach((module) => {
    const currentWeek = parseWeekNumber(module);

    if (currentWeek && currentWeek > 1) {
      const previousWeekModules = weekModules.get(currentWeek - 1) ?? [];
      const previousWeekCompleted = previousWeekModules.every((weekModule) => completedModules.has(weekModule.id));

      if (!previousWeekCompleted) {
        unlockMap.set(module.id, {
          isUnlocked: false,
          reason: `Completa primero la semana ${currentWeek - 1}.`,
        });
        return;
      }
    }

    if (!currentWeek && highestWeek) {
      const thisModuleIndex = path.modules.findIndex((m) => m.id === module.id);
      const hasWeekModuleAfter = path.modules
        .slice(thisModuleIndex + 1)
        .some((m) => parseWeekNumber(m) !== null);
      const isAfterWeeks = !hasWeekModuleAfter;

      if (isAfterWeeks) {
        const lastWeekModules = weekModules.get(highestWeek) ?? [];
        const lastWeekCompleted = lastWeekModules.every((weekModule) => completedModules.has(weekModule.id));

        if (!lastWeekCompleted) {
          unlockMap.set(module.id, {
            isUnlocked: false,
            reason: `Completa primero la semana ${highestWeek}.`,
          });
          return;
        }
      }
    }

    unlockMap.set(module.id, { isUnlocked: true });
  });

  return unlockMap;
}
