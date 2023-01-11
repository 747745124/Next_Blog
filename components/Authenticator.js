import next from 'next';
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context';

//Children only shown to the logged user
export default function Authenticator(props) {
    const { username } = useContext(UserContext);
    //if not signed in, redirect to /enter
    return username ? props.children : props.fallback || <Link href="/enter"><iframe src="https://giphy.com/embed/3ohuPjxqa3oSx7VbAk" width="480" height="360" frameBorder="0" allowFullScreen></iframe></Link>;
}