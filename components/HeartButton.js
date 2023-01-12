import { firestore, auth, increment } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useState } from 'react';


// Allows user to heart or like a post
export default function Heart({ postRef }) {

    console.log(postRef.collection('hearts'));
    // Listen to heart document for currently logged in user
    const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);
    const [canHeart, setHeart] = useState(!(heartDoc?.exists));


    // Create a user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = firestore.batch();

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
        setHeart(false);
    };

    // Remove a user-to-post relationship
    const removeHeart = async () => {
        const batch = firestore.batch();

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
        setHeart(true);
    };

    return canHeart ? (
        <button onClick={addHeart}>💗 Heart</button>
    ) : (
        <button onClick={removeHeart}>💔 Unheart</button>
    );
}