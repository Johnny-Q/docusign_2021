import { useEffect, useState } from "react";
import axios from 'axios';

const LogIn = () => {
    const [test, setTest] = useState("pain");

    useEffect(() => {
        axios.get('http://localhost:5000/api/test', {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        }).then(response => {
            setTest(response.data)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    return <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
        {test}
    </div>
}

export default LogIn;