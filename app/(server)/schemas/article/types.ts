import { TypeOf } from 'zod';
import { createArticleSchema } from './schema';

export type CreateUserSchema = TypeOf<typeof createArticleSchema>;