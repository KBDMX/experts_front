'use client'

import { useState } from "react";
import { useAuth } from "../../../providers/authProvider";
import { dispatchMenssage } from "@/app/utils/menssageDispatcher";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaEnvelope, FaKey } from 'react-icons/fa';

export default function Login() {
    const { handleLogin, handleVerify2FA, isLoggedIn } = useAuth();
    const router = useRouter();

    // Estados para el formulario
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [recordar, setRecordar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para 2FA
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [tempToken, setTempToken] = useState('');
    const [remainingAttempts, setRemainingAttempts] = useState(3);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);

    const handleInitialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await handleLogin(usuario, password, recordar);
            
            if (response) {
                setTempToken(response.tempToken);
                setExpiresAt(response.expiresAt);
                setShowTwoFactor(true);
                dispatchMenssage('info', 'Se ha enviado un código a tu correo electrónico');
            }
        } catch (error) {
            dispatchMenssage('error', 'Error al conectar con el servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTwoFactorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await handleVerify2FA(twoFactorCode, tempToken, recordar);

            if (response.ok) {
                router.push('/sistema/dashboard');
            } else {
                setRemainingAttempts(response.remainingAttempts);
                dispatchMenssage('error', response.message);
                
                if (!response.shouldRetry) {
                    setShowTwoFactor(false);
                    setTwoFactorCode('');
                    setTempToken('');
                }
            }
        } catch (error) {
            dispatchMenssage('error', 'Error al verificar el código');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgot = () => {
        router.push('/sistema/initial/forgot');
    }

    const handleRegister = () => {
        router.push('/sistema/initial/register');
    }

    if (isLoggedIn) {
        router.push('/sistema/dashboard');
        return null;
    }

    return (
        <div className="relative hero min-h-screen bg-base-200">
            <div className="hero-content min-w-0 w-full flex-col lg:flex-row-reverse">
                <h1 className="text-3xl font-bold lg:hidden max-md:text-center">
                    {showTwoFactor ? 'Verificación en dos pasos' : 'Iniciar Sesión'}
                </h1>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    {!showTwoFactor ? (
                        // Formulario inicial de login
                        <form className="card-body" onSubmit={handleInitialSubmit}>
                            <div className="form-control">
                                <label htmlFor="usuario" className="label">
                                    <span className="label-text flex items-center">
                                        <FaUser className="mr-2 text-sm" aria-hidden="true" />
                                        Email o Usuario
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="usuario"
                                    value={usuario}
                                    onChange={e => setUsuario(e.target.value)}
                                    placeholder="Email o Usuario"
                                    className="input input-bordered"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="password" className="label">
                                    <span className="label-text flex items-center">
                                        <FaLock className="mr-2 text-sm" aria-hidden="true" />
                                        Contraseña
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className="input input-bordered"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="recordar" className="label cursor-pointer flex justify-start">
                                    <input
                                        type="checkbox"
                                        id="recordar"
                                        checked={recordar}
                                        onChange={e => setRecordar(e.target.checked)}
                                        className="checkbox checkbox-primary mr-2 checkbox-sm"
                                    />
                                    <span className="label-text">Recordarme</span>
                                </label>
                                <label className="label">
                                    <a
                                        onClick={handleForgot}
                                        className="label-text-alt link link-hover"
                                        href="#"
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => { if (e.key === 'Enter') handleForgot(); }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </label>
                            </div>

                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary flex items-center justify-center"
                                    disabled={isSubmitting}
                                    aria-label="Ingresar"
                                >
                                    <FaSignInAlt className="mr-2 text-xl" aria-hidden="true" />
                                    {isSubmitting ? 'Verificando...' : 'Ingresar'}
                                </button>

                                <button
                                    onClick={handleRegister}
                                    className="btn btn-outline btn-neutral mt-2 lg:hidden flex items-center justify-center"
                                    type="button"
                                    aria-label="Registrarse"
                                >
                                    <FaUserPlus className="mr-2 text-xl" aria-hidden="true" />
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Formulario de verificación 2FA
                        <form className="card-body" onSubmit={handleTwoFactorSubmit}>
                            <div className="form-control">
                                <label htmlFor="twoFactorCode" className="label">
                                    <span className="label-text flex items-center">
                                        <FaKey className="mr-2 text-sm" aria-hidden="true" />
                                        Código de verificación
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="twoFactorCode"
                                    value={twoFactorCode}
                                    onChange={e => setTwoFactorCode(e.target.value)}
                                    placeholder="Ingrese el código"
                                    className="input input-bordered"
                                    required
                                    maxLength={6}
                                    pattern="\d{6}"
                                    aria-required="true"
                                />
                                <label className="label">
                                    <span className="label-text-alt">
                                        Intentos restantes: {remainingAttempts}
                                    </span>
                                    {expiresAt && (
                                        <span className="label-text-alt">
                                            Expira en: {Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000 / 60))} minutos
                                        </span>
                                    )}
                                </label>
                            </div>

                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary flex items-center justify-center"
                                    disabled={isSubmitting}
                                    aria-label="Verificar código"
                                >
                                    <FaKey className="mr-2 text-xl" aria-hidden="true" />
                                    {isSubmitting ? 'Verificando...' : 'Verificar código'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Sección Adicional para Pantallas Grandes */}
                <div className="hidden text-left lg:block max-w-lg">
                    <h1 className="text-5xl font-bold py-6">¿No tienes cuenta todavía?</h1>
                    <button
                        onClick={handleRegister}
                        className="btn btn-outline flex items-center justify-center"
                        type="button"
                        aria-label="Registrarse ahora"
                    >
                        <FaEnvelope className="mr-2 text-xl" aria-hidden="true" />
                        Regístrate ahora
                    </button>
                </div>
            </div>
        </div>
    );
}