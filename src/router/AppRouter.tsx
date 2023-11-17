
import { Navigate, Route, Routes } from 'react-router-dom';

/* Rutas */
import { CaptureView } from '@/views/CaptureView';
import { AuthView } from '@/views/AuthView';
import { Login } from '@/views/Login';

export const AppRouter = () => {


    return (
        <Routes>
            {/* captura de imagen */}
            {/* <Route path="/" element={<AuthView />} /> */}
            {/* vista la imagen del cliente */}
            <Route path="/" element={<Login />} />
            {/*  */}
            <Route path="/*" element={<Navigate to={"/"} />} />
        </Routes>
    )
}
