import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJson } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

//SSG, return props needed for site generation, fetch data in advance
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    //fetch the post data 
    if (userDoc) {
        const postRef = userDoc.ref.collection('posts').doc(slug)
        post = postToJson(await postRef.get());
        //relative path
        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 3000
    };

};

//return dynamical routes for SSG, in the format /[username]/[slug]
export async function getStaticPaths() {
    const snapshot = await firestore.collectionGroup('posts').get();
    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        // must be in this format:
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        //re-run each time a new post is created, SSR
        fallback: 'blocking',
    };
};

export default function PostPage(props) {

    const postRef = firestore.doc(props.path);
    const [realtimePost] = useDocumentData(postRef);

    //the post is default to the real time data, otherwise, it can be a SSR version
    const post = realtimePost || props.post;

    return (
        <main className={styles.container}>
            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>

            </aside>
        </main>
    );
};