import React, { useState } from 'react';
import axios from 'axios';

const TwoFactorAuthPopup = ({ userId, onSuccess }: { userId: string, onSuccess: () => void }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/verify-2fa', { userId, code });
            if (response.data.ok) {
                onSuccess(); // Redirige al dashboard u otra acción
            }
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Error al validar el código 2FA');
        }
    };

    return (
        <div className="popup">
            <form onSubmit={handleSubmit}>
                <label htmlFor="code">Ingrese el código 2FA:</label>
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Validar</button>
            </form>
        </div>
    );
};

export default TwoFactorAuthPopup;
