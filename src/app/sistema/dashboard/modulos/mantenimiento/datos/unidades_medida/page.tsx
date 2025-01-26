'use client';
import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import {
    getUnidadesMedida,
    postUnidadMedida,
    putUnidadMedida,
    deleteUnidadMedida,
} from "@/api/mantenimiento/unidades_medida.api";

export default function UnidadesDeMedidaPage() {
    return (
        <PaginaGenerica
            nombrePagina="Unidades De Medida"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.875 12c.621 0 1.125.512 1.125 1.143v5.714c0 .631-.504 1.143-1.125 1.143H4a1 1 0 0 1-1-1v-5.857C3 12.512 3.504 12 4.125 12zM9 12v2m-3-2v3m6-3v3m6-3v3m-3-3v2M3 3v4m0-2h18m0-2v4" />
                </svg>
            }
            fetchData={getUnidadesMedida}
            createData={postUnidadMedida}
            updateData={putUnidadMedida}
            deleteData={deleteUnidadMedida}

            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", required: true, type: "text", example: "KG" },
            ]}
            visibleColumns={{
                nombre: "Nombre",
            }}
            modificationLabelId={{ label: "ID Medida", key: "id_medida" }}
        />
    );
}
