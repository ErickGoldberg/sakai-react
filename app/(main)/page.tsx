/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { EventService } from '../../demo/service/EventService';
import { Demo } from '../../types/demo';
import { ChartData, ChartOptions } from 'chart.js';
import CrudPets from './pages/crudPets/page';
import { ProductService } from '../../demo/service/ProductService';
import Link from 'next/link';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { DemoEvent } from '../../types/types';

const Dashboard = () => {
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [servicos, setServicos] = useState<null | Demo.Event[]>(null);
    const servicesCount: number[] = [120, 80, 45, 30, 15];
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [serviceLabels, setServiceLabels] = useState<string[]>([]);

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
