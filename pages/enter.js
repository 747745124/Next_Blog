import { auth, googleAuthProvider, firestore } from "../lib/firebase";
import { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';

export default function Enter({ props }) {
    const { user, username } = useContext(UserContext);
    //render username on condition
    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </main>
    );
};

//sign in with google button
function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            await auth.signInWithPopup(googleAuthProvider);
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    )

}

//sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>SignOut</button>
}



//select user name 
function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    //submit the document to the db
    const onSubmit = async (e) => {
        e.preventDefault();

        //create handler for both docs
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`username/${formValue}`);

        //commit both docs as a write
        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = (e) => {
        //form change
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        };

    };

    //only check the username's validity when it pass the RE test
    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log('Firestore read executed!');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (<section>
            <h3>Choose Username</h3>
            <form onSubmit={onSubmit}>
                <input name="username" placeholder="Username" value={formValue} onChange={onChange} />
                <button type="submit" className="btn-green" disabled={!isValid}>
                    Submit
                </button>

                <h3>Debug State</h3>
                <div>
                    Username:{formValue}
                    <br />
                    Loading:{loading.toString()}
                    <br />
                    Username validity:{isValid.toString()}
                </div>
            </form>
        </section>)

    );

}