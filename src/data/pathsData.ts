
import type { PathModule, CollapsibleContent, ExerciseContent, ModuleContent, Path } from './paths/pathTypes';
import { stressManagementPath } from './paths/stressManagementPath';
import { uncertaintyPath } from './paths/uncertaintyPath';
import { procrastinationPath } from './paths/procrastinationPath';
import { settingBoundariesPath } from './paths/settingBoundariesPath';
import { empathyPath } from './paths/empathyPath';
import { selfUnderstandingPath } from './paths/selfUnderstandingPath';
import { purposePath } from './paths/purposePath';
import { resiliencePath } from './paths/resiliencePath';
import { coherencePath } from './paths/coherencePath';
import { responsibilityPath } from './paths/responsibilityPath';
import { supportNetworkPath } from './paths/supportNetworkPath';
import { wellbeingPath } from './paths/wellbeingPath';
import { anxietyPath } from './paths/anxietyPath'; 

// Re-export types for easy access in other parts of the application
// Re-export types for easy access in other parts of the application
export type { PathModule, CollapsibleContent, ExerciseContent, ModuleContent, Path };

// Now, the pathsData array will be built from imported path definitions.
// This makes the file cleaner and scales better as more paths are added.
export const pathsData: Path[] = [
  stressManagementPath,
  uncertaintyPath,
  procrastinationPath,
  settingBoundariesPath,
  empathyPath,
  selfUnderstandingPath,
  purposePath,
  resiliencePath,
  coherencePath,
  responsibilityPath,
  supportNetworkPath,
  wellbeingPath,
  anxietyPath,
];

    
    

