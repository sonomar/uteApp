import { getArticlesByAuthor } from "@/app/(server)/lib/article";
import { config } from "@/app/(server)/utils/helpers";
import { Article } from "@prisma/client";
import { getServerSession } from "next-auth";

const Main = async() => {
    const session = await getServerSession(config)
    const authorArticles = await getArticlesByAuthor((session?.user as any).id)
    return (
            <>
                <div>
                    <p>You are logged in!</p>
                </div>
                <div>
                        {
                            authorArticles.map((article:Article) => {
                                return <p key={article.title}>{article.title}</p>
                            })
                        }
                </div>
            </>
    );
};

export default Main;