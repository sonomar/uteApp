import { ApiError } from '@/app/(server)/utils/apiError';

export class ArticleAlreadyExistError extends ApiError {
    constructor() {
        super(409, 'article already exist at given coordinates');
    }
}