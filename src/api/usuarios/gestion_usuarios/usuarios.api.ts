import { UUID } from 'crypto';
import { baseUrl } from '../../mantenimiento/config.api';

export async function getUsuarios() {
    try {
        const res = await fetch(baseUrl + '/usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        console.log("DATA", data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putUsuario(userData: any) {
    try {
        const res = await fetch(baseUrl + '/usuarios', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
/*
export async function deleteUsuario(userData: any) {
    try {
        const res = await fetch(baseUrl + '/usuarios', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
*/
export async function deleteUsuario(id_usuario: string) {
    try {
        const res = await fetch(`${baseUrl}/usuarios/${id_usuario}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("ERROR", err);
        throw err;
    }
}
export async function postUsuario(userData: any) {
    try {
        const res = await fetch(baseUrl + '/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}