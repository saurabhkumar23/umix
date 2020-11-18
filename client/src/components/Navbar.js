import React from 'react'
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <section id="navbar">
            <nav>
                <div className="nav-wrapper white">
                    <Link to="/" className="brand-logo left">Umix</Link>
                    <ul id="nav-mobile" className="right">
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/create">Create Post</Link></li>
                    </ul>
                </div>
            </nav>
        </section>
    );
}

export default Navbar
