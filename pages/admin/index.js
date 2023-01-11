import Authenticator from "../../components/Authenticator"
import { auth } from "../../lib/firebase"
import { firestore } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { kebabCase } from "lodash";
import styles from "../../styles/Admin.module.css"
import { useRouter } from "next/router";
import { UserContext } from "../../lib/context";
import { useContext, useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function AdminPostsPage(props) {
    return (<main>
        <Authenticator>
            <PostList />

            <CreateNewPost />
        </Authenticator>
    </main>)
}

function PostList() {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
    const query = ref.orderBy('createdAt');
    //retrieve snapshot
    const [querySnapShot] = useCollection(query);

    const posts = querySnapShot?.docs.map((doc) => doc.data());

    return (<>
        <h1>Manage Your Posts</h1>
        <PostFeed posts={posts} admin />
    </>)

}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    //Ensure the slug is URL safe;
    const slug = encodeURI(kebabCase(title));
    const isValid = title.length > 3 && title.length < 100;

    //create a new post from firestore;
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        //slug as id, prevent automatic id
        const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

        //Give all fields a default value to prevent null check
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# Hello World!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0
        }

        //create new data
        await ref.set(data);
        toast.success('Post created!');

        //navigate to newly created post
        router.push(`/admin/${slug}`);
    };

    return (<form onSubmit={createPost}>
        <input value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title"
            className={styles.input}
        />
        <p>
            <strong>Slug:</strong>{slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">Create New Post</button>
    </form>)
}

function createPost() {

}