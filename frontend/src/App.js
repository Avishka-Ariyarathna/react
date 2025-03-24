import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const addUser = () => {
        axios.post('http://localhost:5000/users', { name, email })
            .then(() => window.location.reload())
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}
            </ul>
            <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <button onClick={addUser}>Add User</button>
        </div>
    );
}

export default App;
