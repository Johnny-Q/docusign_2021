import { useState } from "react";
import { register } from "../logic/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (name === "" || email === "" || password === "" || password !== confirmPassword) {
            return
        }

        register(name, email, password);
        
    }

    return <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
        <div style={{width: '25vw', minWidth: '250px', display: 'flex', flexDirection: "column", alignItems: "flex-start"}}>
            <h1>Register</h1>
            <input style={{ borderRadius: 99, padding: '10px 20px 10px 20px', width: '100%', fontSize: "1em", boxSizing: 'border-box' }} type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <br />
            <input style={{ borderRadius: 99, padding: '10px 20px 10px 20px', width: '100%', fontSize: "1em", boxSizing: 'border-box' }} type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <br />
            <input style={{borderRadius: 99, padding: '10px 20px 10px 20px', width: '100%', fontSize: "1em", boxSizing: 'border-box' }} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <br />
            <input style={{borderRadius: 99, padding: '10px 20px 10px 20px', width: '100%', fontSize: "1em", boxSizing: 'border-box' }} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <br />
            <button style={{borderRadius: 99, padding: '10px 20px 10px 20px', textAlign: 'center', fontSize: "1em", width: '100%'}} onClick={handleRegister}>Register</button>
            <p>Already have an account? <a href="/login">Log in here</a>.</p>
        </div>
    </div>
}

export default Register;