'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getUsuarios, putUsuario, deleteUsuario, postUsuario } from "@/api/usuarios/gestion_usuarios/usuarios.api";

export default function UsuariosPage() {
    return (
        <PaginaGenerica
            nombrePagina="Usuarios"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            }
            fetchData={async () => {
                const response = await getUsuarios();
                return response.data;
            }}
            updateData={async (userData) => {
                // Extraer el valor del rol del objeto
                const rolValue = userData.rol?.value || userData.rol;
                return await putUsuario({
                    id_usuario: userData.id_usuario,
                    rol: rolValue
                });
            }}
           
            deleteData={async (userData) => {
                // Extraer el ID del array
                const idUsuario = Array.isArray(userData) ? userData[0] : userData;
                return await deleteUsuario(idUsuario);
            }}
            
            createData={() => Promise.resolve()} // función vacía
            formFieldsConfig={() => [
                { label: "Usuario", key: "usuario", example: 'Nombre de usuario', type: 'text', disabled: true },
                { label: "Email", key: "email", example: 'correo@ejemplo.com', type: 'email', disabled: true },
                { 
                    label: "Rol", 
                    key: "rol", 
                    type: 'select',
                    options: [
                        { value: 'admin', label: 'Administrador' },
                        { value: 'finca', label: 'Finca' }
                    ],
                    valueKey: 'value', // Especificamos que queremos usar el campo 'value'
                    labelKey: 'label',  // Especificamos que queremos usar el campo 'label' para mostrar
                }
            ]}
            visibleColumns={{
                usuario: "Usuario",
                email: "Email",
                rol: "Rol"
            }}
            modificationLabelId={{ label: "ID Usuario", key: "id_usuario" }}
            formClassName="grid-cols-1"
        />
    );
}