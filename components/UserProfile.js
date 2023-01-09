import { userAgent } from "next/server";

export default function UserProfilePage({ user }) {
    return (
        <main>
            <div className="box-center">
                <img src={user.photoURL} className="card-img-center" />
                <p>
                    <i>
                        @{user.username}
                    </i>
                </p>
                <h1>{user.displayName}</h1>
            </div>
        </main>
    )
}