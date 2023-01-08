import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

//top navbar
export default function NavBar() {

    const { user, username } = useContext(UserContext);

    return (<nav className="navbar">
        <ul>
            <li>
                <Link href="/">
                    <button className='btn-logo'>FEED</button>
                </Link>
            </li>

            {/* if user is signed in, display icon and write post button */}

            {username && (
                <>
                    <li className='push-left'>
                        <Link href="/admin">
                            <button className='btn-blue'>Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL} />
                        </Link>
                    </li>
                </>
            )}

            {/* if user is not signed in, display log in button */}

            {!username && (
                <>
                    <li>
                        <Link href="/enter">
                            <button className='btn-blue'>Log in</button>
                        </Link>
                    </li>
                </>
            )}





        </ul>
    </nav>);
}