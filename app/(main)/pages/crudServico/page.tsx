'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { EventService } from '../../../../demo/service/EventService';
import { Demo } from '../../../../types/types';
import { Menu } from 'primereact/menu';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import {  getDatabase, ref, push, update, remove, child, } from "firebase/database";



const firebaseConfig = {
    apiKey: 'AIzaSyDln_aynwxbhCOh9O3xcT1RXQnfQkNgPPc',
    authDomain: 'fnr-devops.firebaseapp.com',
    projectId: 'fnr-devops',
    storageBucket: 'fnr-devops.appspot.com',
    messagingSenderId: '893145544957',
    appId: '1:893145544957:web:8884874c956f24bbce2694',
    measurementId: 'G-WDYGHM4JM8'
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const CrudServico = ({}) => {
    let servicoVazio: Demo.Event = {
        id: '',
        name: '',
        descricao: '',
        preco: 0,
        duracao: 0
    };

    const [servicos, setServicos] = useState<null | Demo.Event[]>(null);
    const [servicoDialog, setServicoDialog] = useState(false);
    const [selectedServicos, setSelectedServicos] = useState<Demo.Event[] | null>(null);
    const [deleteServicoDialog, setDeleteServicoDialog] = useState(false);
    const [deleteServicosDialog, setDeleteServicosDialog] = useState(false);
    const [servico, setServico] = useState<Demo.Event>(servicoVazio);
    const [servicosSelecionados, setServicosSelecionados] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    type ServicoKey = keyof Demo.Event;

    useEffect(() => {
        EventService.getEvents().then((data) => setServicos(data as any));
    }, []);

    const openNew = () => {
        setServico(servicoVazio);
        setSubmitted(false);
        setServicoDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setServicoDialog(false);
    };

    const hideDeleteServicosDialog = () => {
        setDeleteServicosDialog(false);
    };

    const saveServico = async () => {
        setSubmitted(true);
    
        if (servico.name.trim()) {
            const db = getDatabase();
        
            let _servico = { ...servico};
        
            if (servico.id) {

              const servicoRef = ref(db, `servicos/${servico.id}`);
              await update(servicoRef, servico);
            } else {
         
              const servicosRef = ref(db, "servicos");
              const newServicoRef = push(servicosRef);
              const newProductId = newServicoRef.key;
        
              const newServicoData = {
                id: servico.id,
                name: servico.name,
                descricao: servico.descricao,
                preco: servico.preco,
                duracao: servico.duracao
              };
        
              await addDoc(collection(getFirestore(), "servicos"), newServicoData);
            }
        
            toast.current?.show({
              severity: "success",
              summary: "Successful",
              detail: servico.id ? "Product Updated" : "Product Created",
              life: 3000,
            });
        
            setServicoDialog(false);
            setServico(servicoVazio);
          }
        };

    const editServico = (servico: Demo.Event) => {
        setServico({ ...servico });
        setServicoDialog(true);
    };

    const confirmDeleteServico = (servico: Demo.Event) => {
        setServico(servico);
        setDeleteServicoDialog(true);
    };

    const deleteServico = () => {
        let _servicos = (servicos as unknown as Demo.Event[])?.filter((val: Demo.Event) => val.id !== servico.id);
        setServicos(_servicos);
        setDeleteServicoDialog(false);
        setServico(servicoVazio);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Serviço Excluído',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (servicos as unknown as Demo.Event[])?.length; i++) {
            if ((servicos as unknown as Demo.Event[])[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const confirmDeleteSelected = () => {
        setDeleteServicosDialog(true);
    };

    const deleteSelectedServicos = () => {
        let _servicos = (servicos as unknown as Demo.Event[])?.filter((val: Demo.Event) => !(selectedServicos as Demo.Event[])?.includes(val));
        setServicos(_servicos);
        setDeleteServicosDialog(false);
        setSelectedServicos(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Serviços Excluídos',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Demo.Event) => {
        const val = e.target.value || '';
        setServico((prevServico) => ({
            ...prevServico,
            [name]: val
        }));
    };

    const onInputNumberChange = (e: InputNumberChangeEvent, name: 'preco' | 'duracao') => {
        const val = e.value || 0;
        let _servico = { ...servico };
        _servico[name] = val;

        setServico(_servico);
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedServicos || !(selectedServicos as Demo.Event[]).length} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Demo.Event) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Event) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.name}
            </>
        );
    };

    const descricaoBodyTemplate = (rowData: Demo.Event) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
            </>
        );
    };

    const precoBodyTemplate = (rowData: Demo.Event) => {
        return (
            <>
                <span className="p-column-title">Preço</span>
                {rowData.preco}
            </>
        );
    };

    const duracaoBodyTemplate = (rowData: Demo.Event) => {
        return (
            <>
                <span className="p-column-title">Duração</span>
                {rowData.duracao}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Event) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editServico(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteServico(rowData)} />
            </>
        );
    };
    const countServices = (servicos: Demo.Event[] | null): Record<string, number> => {
        const serviceCount: Record<string, number> = {};

        if (servicos) {
            servicos.forEach((servico) => {
                const serviceName = servico.name;

                if (!serviceCount[serviceName]) {
                    serviceCount[serviceName] = 1;
                } else {
                    serviceCount[serviceName]++;
                }
            });
        }

        return serviceCount;
    };
    const servicoCount = countServices(servicos);

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Serviços cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e?.currentTarget?.value || '')} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const servicoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveServico} />
        </>
    );

    const deleteServicoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteServicosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteServico} />
        </>
    );

    const deleteServicosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteServicosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedServicos} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={servicos}
                        selection={selectedServicos}
                        onSelectionChange={(e) => setSelectedServicos(e?.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} tutores"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum serviço encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" body={idBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header="Nome" body={nameBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="descricao" header="Descrição" body={descricaoBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="preco" header="Preço" body={precoBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="duracao" header="Duração" body={duracaoBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={servicoDialog} style={{ width: '450px' }} header="Cadastrar Serviço" modal className="p-fluid" footer={servicoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nome do Serviço</label>
                            <InputText
                                id="name"
                                value={servico.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !servico.name
                                })}
                            />
                            {submitted && !servico.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descricao">Descrição</label>
                            <InputTextarea id="descricao" value={servico.descricao} onChange={(e) => onInputChange(e, 'descricao')} required
                             className={classNames({
                                'p-invalid': submitted && !servico.descricao
                            })}
                        />
                        {submitted && !servico.descricao && <small className="p-invalid">Descrição é obrigatório.</small>} 
                        </div>
                        <div className="field">
                            <label htmlFor="preco">Preço</label>
                            <InputNumber id="preco" value={servico.preco} onChange={(e) => onInputNumberChange(e, 'preco')} required
                             className={classNames({
                                'p-invalid': submitted && !servico.preco
                            })}
                        />
                        {submitted && !servico.preco && <small className="p-invalid">Preço é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="duracao">Duração</label>
                            <InputNumber id="duracao" value={servico.duracao} onChange={(e) => onInputNumberChange(e, 'duracao')} required 
                             className={classNames({
                                'p-invalid': submitted && !servico.duracao
                            })}
                        />
                        {submitted && !servico.duracao && <small className="p-invalid">Duração é obrigatório.</small>} 
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServicoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServicoDialogFooter} onHide={hideDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {servico && (
                                <span>
                                    Tem certeza que deseja excluir <b>{servico.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServicosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServicoDialogFooter} onHide={hideDeleteServicosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {servico && <span>Tem certeza que deseja excluir esse serviço?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default CrudServico;
