import { z } from 'zod';

import { caseSchema } from './schemas';

export type CaseFormValues = z.input<typeof caseSchema>;
