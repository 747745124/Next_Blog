import UserProfilePage from "../../components/UserProfile";
import PostFeedPage from "../../components/PostFeed"
import { getUserWithUsername, postToJson } from '../../lib/firebase'

export async function getServerSideProps({ query }) {
    const { username } = query;
    const userDoc = await getUserWithUsername(username);

    let user = null;
    let posts = null;
    //retrieve the posts the user authored
    if (userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref.collection('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5);

        posts = (await postsQuery.get()).docs.map(postToJson);
    }

    return {
        props: { user, posts }
    };
}


export default function MyPage({ user, posts }) {
    return (
        <main>
            <UserProfilePage user={user} />
            <PostFeedPage posts={posts} />
        </main>
    );
};