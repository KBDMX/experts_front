// hooks/useCatalogos.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/mantenimiento/config.api';

const useCatalogosCooFincas = (endpoint: string) => {
    const [data, setData] = useState<{ id: any; nombre: any }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/${endpoint}`);
                const catalogData = response.data.map((item: any) => {
                    const keys = Object.keys(item);
                    return {
                        id: item[keys[0]],  // Tomamos el primer atributo como ID
                        nombre: item.nombre || item.descripcion || keys[1] // Buscamos el campo nombre
                    };
                });
                setData(catalogData);
            } catch (err) {
                setError('Error cargando catálogo');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};

export default useCatalogosCooFincas;