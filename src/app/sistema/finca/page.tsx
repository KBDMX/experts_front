'use client';
// pages/gestion-coordinaciones.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/mantenimiento/config.api';
import useCatalogosCooFincas from '@/hooks/useCatalogosCooFincas';
// Configuración de axios
axios.defaults.withCredentials = true;

const GestionCoordinaciones = () => {
    const [coordinaciones, setCoordinaciones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCoordinacion, setSelectedCoordinacion] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { data: clientes } = useCatalogosCooFincas('coordinacion_finca/clientes');
    const { data: productos } = useCatalogosCooFincas('coordinacion_finca/productos');
    // Obtener coordinaciones al cargar el componente
    useEffect(() => {
        const fetchCoordinaciones = async () => {
            try {
                const response = await axios.get(`${baseUrl}/coordinacion_finca`);
                setCoordinaciones(response.data);
            } catch (err) {
                setError('Error al cargar las coordinaciones');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoordinaciones();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Manejar creación de guía hija (versión actualizada)
    const handleCreateGuiaHija = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCoordinacion) return;

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        // Asegurar que los valores no sean NaN
        const guiaData = {
            id_coordinacion: selectedCoordinacion,
            id_producto: Number(formData.get('producto')) || 0, // Valor por defecto
            id_cliente: Number(formData.get('cliente')) || 0,   // Valor por defecto
            peso: Number(formData.get('peso')) || 0,
        };

        // Validación básica
        if (guiaData.id_producto <= 0 || guiaData.id_cliente <= 0) {
            alert('Seleccione un producto y cliente válidos');
            return;
        }

        try {
            await axios.post(`${baseUrl}/coordinacion_finca`, guiaData); // Ruta completa
            setShowModal(false);
            // Actualizar lista (opcional)
            const response = await axios.get(`${baseUrl}/coordinacion_finca`);
            setCoordinaciones(response.data);
        } catch (err) {
            console.error('Error creando guía hija:', err);
            alert('Error al crear la guía hija'); // Feedback al usuario
        }
    };

    if (isLoading) return <div className="text-center mt-8">Cargando...</div>;
    if (error) return <div className="text-center mt-8 text-error">{error}</div>;

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Sección de Bienvenida */}
            <div className="mb-8">
                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h1 className="card-title text-3xl">👋 Bienvenido al Módulo de Gestión</h1>
                        <p className="text-lg">Aquí podrás gestionar todas las coordinaciones y sus guías asociadas</p>
                    </div>
                </div>
            </div>

            {/* Tabla de Coordinaciones */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title mb-4">Coordinaciones Activas</h2>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th></th> {/* Nueva columna para expandir */}
                                    <th>ID</th>
                                    <th>Fecha Vuelo</th>
                                    <th>Producto</th>
                                    <th>Destino AWB</th>
                                    <th>Agencia IATA</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coordinaciones?.map((coordinacion) => (
                                    <>
                                        <tr
                                            key={coordinacion.id}
                                            className="hover:bg-base-200 cursor-pointer"
                                        >
                                            <td>
                                                {/* Ícono de expansión */}
                                                <span className="text-lg">
                                                    {coordinacion.guias_hijas?.length > 0 ? '▼' : '○'}
                                                </span>
                                            </td>
                                            <td>{coordinacion.id}</td>
                                            <td>{formatDate(coordinacion.fecha_vuelo)}</td>
                                            <td>{coordinacion.producto?.nombre}</td>
                                            <td>{coordinacion.destino_awb?.nombre}</td>
                                            <td>{coordinacion.agencia_iata?.codigo}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCoordinacion(coordinacion.id);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    Agregar Guía
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Panel expandible con guías hijas */}
                                        <tr className="bg-base-200">
                                            <td colSpan={7}>
                                                <div className="collapse collapse-arrow">
                                                    <input type="checkbox" className="peer" />
                                                    <div className="collapse-title p-2">
                                                        <span className="font-semibold">
                                                            {coordinacion.guias_hijas?.length || 0} Guías Hijas
                                                        </span>
                                                    </div>
                                                    <div className="collapse-content">
                                                        <table className="table table-xs w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Producto</th>
                                                                    <th>Cliente</th>
                                                                    <th>Peso (kg)</th>
                                                                    <th>Fecha Creación</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {coordinacion.guias_hijas?.length > 0 ? (
                                                                    coordinacion.guias_hijas.map((guia: any) => (
                                                                        <tr key={guia.id}>
                                                                            <td>{guia.id}</td>
                                                                            <td>{productos.find(p => p.id === guia.id_producto)?.nombre}</td>
                                                                            <td>{clientes.find(c => c.id === guia.id_cliente)?.nombre}</td>
                                                                            <td>{guia.peso}</td>
                                                                            <td>{formatDate(guia.createdAt)}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={5} className="text-center">
                                                                            No hay guías hijas registradas
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para crear Guía Hija */}
            <div className={`modal ${showModal ? 'modal-open' : ''}`}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Crear Nueva Guía Hija</h3>
                    <form onSubmit={handleCreateGuiaHija}>
                        {/* Select para Productos */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Producto</span>
                            </label>
                            <select
                                name="producto"
                                className="select select-bordered w-full"
                                required
                                disabled={productos.length === 0}
                            >
                                {productos.length === 0 ? (
                                    <option>Cargando productos...</option>
                                ) : (
                                    <>
                                        <option value="">Seleccione un producto</option>
                                        {productos.map(producto => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.nombre}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Select para Clientes */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Cliente</span>
                            </label>
                            <select
                                name="cliente"
                                className="select select-bordered w-full"
                                required
                                disabled={clientes.length === 0}
                            >
                                {clientes.length === 0 ? (
                                    <option>Cargando clientes...</option>
                                ) : (
                                    <>
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Peso (kg)</span>
                            </label>
                            <input
                                type="number"
                                name="peso"
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Crear Guía
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GestionCoordinaciones;