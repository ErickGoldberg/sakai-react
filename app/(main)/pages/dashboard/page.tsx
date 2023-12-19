/* eslint-disable @next/next/no-img-element */
'use client';
import { ChartOptions } from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Demo } from '../../../../types/demo';
import CrudPets from '../crudPets/page';

const Dashboard = () => {
    const [products, setProducts] = useState<Demo.Product[]>([]);

    const [lineOptions, setLineOptions] = useState<ChartOptions>();
    const { layoutConfig } = useContext(LayoutContext);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Pets Cadastrados Recentemente</h5>
                    <CrudPets />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
