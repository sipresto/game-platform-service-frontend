import {Link} from "react-router"

export function PublicPage() {
    return (
        <>
            <div style={{fontSize: '3rem', textAlign: 'center', marginTop: '2rem'}}>
                I'm a public page
            </div>
            <Link to="/securedpage">Go to secured page</Link>
        </>
    )
}