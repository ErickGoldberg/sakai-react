import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" style={{ bottom: '50px', position: 'relative' }}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="/demo/images/logo.png" style={{ width: '500px' }} alt="Recife Pet logo" className="w-20rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <span className="text-blue-400 font-bold text-5xl">Página não encontrada!</span>
                        <h1 className="text-700 font-bold text-2xl mb-2">Volte para a home no link abaixo </h1>
                        <Link href="/" className="w-full flex align-items-center py-4 border-300 border-bottom-1">
                            <span className="flex justify-content-center align-items-center bg-cyan-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                <i className="text-50 pi-home pi pi-fw pi-table text-2xl"></i>
                            </span>
                            <span className="text-900 lg:text-xl font-medium" style={{ marginLeft: '10px' }}>
                                Home
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
