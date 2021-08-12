import { useState } from "react";
import { login } from '../logic/auth';

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogIn = () => {
        if (email === "" || password === "") {
            return
        }

        login(email, password);
        
    }

    return <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
        <div style={{width: '25vw', minWidth: '250px', display: 'flex', flexDirection: "column", alignItems: "flex-start"}}>
            <h1>Log In</h1>
            <input style={{ borderRadius: 99, padding: '10px 20px 10px 20px', width: '100%', fontSize: "1em", boxSizing: 'border-box' }} type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <br />
            <input style={{borderRadius: 99, padding: '10px 20px 10px 20px', width: '100%', fontSize: "1em", boxSizing: 'border-box' }} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <br />
            <button style={{borderRadius: 99, padding: '10px 20px 10px 20px', textAlign: 'center', fontSize: "1em", width: '100%'}} onClick={handleLogIn}>Log In</button>
            <p>New to Conservatr? <a href="/register">Register here</a>.</p>
        </div>
    </div>
}

export default LogIn;