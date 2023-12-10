import { ApiError } from '@/app/(server)/utils/apiError';

export class ArticleNotFoundError extends ApiError {
    constructor() {
        super(409, 'article not found');
    }
}