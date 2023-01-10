import Link from "next/link";
export default function _404Page() {
    return (
        <main>
            <h1>Oops... It seems that you have entered a mysterious place...</h1>
            <iframe src="https://giphy.com/embed/UHAYP0FxJOmFBuOiC2"
                width="480" height="361" frameBorder="0" allowFullScreen>
            </iframe>
            <Link href="/">
                <button className="btn-blue">Let's go home.</button>
            </Link>
        </main>
    )
}