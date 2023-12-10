import { prisma } from '@/app/shared/lib/prisma';
import { Article, Prisma } from '@prisma/client';
import { ArticleAlreadyExistError, ArticleNotFoundError } from '@/app/(server)/errors';

export const getArticle = async (id: string): Promise<Article> => {
    const article = await prisma.article.findFirst({
        where: {
            id,
        },
        include: {
            author: true,
        },
    });

    if (!article) throw new ArticleNotFoundError();

    return { ...article };
};

export const getArticlesByAuthor = async (authorId: string): Promise<Article[]> => {
    const articles = await prisma.article.findMany({
        where: {
            authorId,
        },
        include: {
            author: true,
        },
    });

    if (!articles) throw new ArticleNotFoundError();

    return articles;
};

export const createArticle = async (
    title: string,
    published: boolean,
    authorId: string,
    description: string,
    body: string
): Promise<Article> => {
        let article: Article | null;

        article = await prisma.article.findFirst({
            where: {
                title
            },
        });

        if (article) throw new ArticleAlreadyExistError();

        const articleData: Prisma.ArticleCreateManyInput = {
            title,
            description,
            body,
            published,
            authorId
        };
    
        const createdArticle = await prisma.article.create({
            data: articleData,
        });
    
        return createdArticle;
    };