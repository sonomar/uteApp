import { getArticlesByAuthor } from "@/app/(server)/lib/article";
import { config } from "@/app/(server)/utils/helpers";
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
                    <pre>
                        {JSON.stringify(authorArticles)}
                    </pre>
                </div>
            </>
    );
};

export default Main;