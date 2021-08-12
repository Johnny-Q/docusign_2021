import { useEffect } from 'react';
import { logout } from '../logic/auth';

const LogOut = () => {

    useEffect(() => {
        logout();
    }, [])

    return (
        <div>Logging out...</div>
    )
}

export default LogOut;