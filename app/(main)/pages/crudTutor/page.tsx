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
import { CustomerService } from '../../../../demo/service/CustomerService';
import { Demo } from '../../../../types/types';
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
const db = getDatabase(app);
type Customer = Demo.Customer;
const CrudTutores = () => {
    let tutorVazio: Demo.Customer = { 
        id: '',
        name: '',
        rua: '',
        bairro: '',
        numero: 0,
        cidade: '',
        cep: '',
        estado: '',
        telefone: '',
        cpf: '',
        sexo: 'M'
    };

    const [tutores, setTutores] = useState<null | Demo.Customer[]>(null);
    const [tutorDialog, setTutorDialog] = useState(false);
    const [selectedTutors, setSelectedTutores] = useState<Demo.Customer[] | null>(null);
    const [deleteTutorDialog, setDeleteTutorDialog] = useState(false);
    const [deleteTutoresDialog, setDeleteTutoresDialog] = useState(false);
    const [tutor, setTutor] = useState<Demo.Customer>(tutorVazio);
    const [tutoresSelecionados, setTutoresSelecionados] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const [cepInfo, setCepInfo] = useState<{ cidade: string; estado: string; bairro: string } | null>(null);
    const dt = useRef<DataTable<any>>(null);
    type TutorKey = keyof Demo.Customer;
  
    useEffect(() => {
        CustomerService.getCustomersLarge().then((data) => setTutores(data as any));
    }, []);

    const openNew = () => {
        setTutor(tutorVazio);
        setSubmitted(false);
        setTutorDialog(true);
    };
    
    const hideDialog = () => {
        setSubmitted(false);
        setTutorDialog(false);
    };
    
    const hideDeleteTutoresDialog = () => {
        setDeleteTutoresDialog(false);
    };
    
    const saveTutor = async () => {
        setSubmitted(true);
    
        if (tutor.name.trim()) {
            const db = getDatabase();
            
            let _tutor = { ...tutor };

            if (cepInfo) {
                _tutor.cidade = cepInfo.cidade;
                _tutor.estado = cepInfo.estado;
                _tutor.bairro = cepInfo.bairro;
            }
            
            if (_tutor.id) {
                const tutorRef = ref(db, `tutors/${_tutor.id}`);
                await update(tutorRef, _tutor);
            } else {
           
                const tutoresRef = ref(db, "tutors");
                const newTutorRef = push(tutoresRef);
                const newTutorId = newTutorRef.key;
            
                const newTutorData = {
                    id: newTutorId,
                    name: _tutor.name,
                    rua:_tutor.rua,
                    bairro: _tutor.bairro,
                    numero: _tutor.numero,
                    cidade: _tutor.cidade,
                    cep: _tutor.cep,
                    estado: _tutor.estado,
                    telefone: _tutor.telefone,
                    cpf: _tutor.cpf,
                    sexo: _tutor.sexo
                };
            
                await addDoc(collection(getFirestore(), "tutors"), newTutorData);
            }
            
            toast.current?.show({
                severity: "success",
                summary: "Successful",
                detail: _tutor.id ? "Tutor Updated" : "Tutor Created",
                life: 3000,
            });
            
            setTutorDialog(false);
            setTutor(tutorVazio);
        }
    };
    
    const editTutor = (tutor: Demo.Customer) => {
        setTutor({ ...tutor });
        setTutorDialog(true);
    };
    
    const confirmDeleteTutor = (tutor: Demo.Customer) => {
        setTutor(tutor);
        setDeleteTutorDialog(true);
    };
    
    const deleteTutor = () => {
        let _tutores = (tutores as unknown as Demo.Customer[])?.filter((val: Demo.Customer) => val.id !== tutor.id);
        setTutores(_tutores);
        setDeleteTutorDialog(false);
        setTutor(tutorVazio);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tutor Excluído',
            life: 3000
        });
    };
    
    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (tutores as unknown as Demo.Customer[])?.length; i++) {
            if ((tutores as unknown as Demo.Customer[])[i].id === id) {
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
        setDeleteTutoresDialog(true);
    };
    
    const deleteSelectedTutors = () => {
        let _tutores = (tutores as unknown as Demo.Customer[])?.filter((val: Demo.Customer) => !(selectedTutors as Demo.Customer[])?.includes(val));
        setTutores(_tutores);
        setDeleteTutoresDialog(false);
        setSelectedTutores(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tutores Excluídos',
            life: 3000
        });
    };
    
    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _tutor = { ...tutor };
        _tutor['sexo'] = e.value;
        setTutor(_tutor);
    };
    
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target?.value || '';
        let _tutor = { ...tutor };
        _tutor[name] = val;
        if (name === 'cep') {
            fetchCepInfo(val);
        }
        setTutor(_tutor);
    };

    const fetchCepInfo = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.ok) {
                const data = await response.json();
    
                setCepInfo({
                    cidade: data.localidade,
                    estado: data.uf,
                    bairro: data.bairro
                });
            } else {
                setCepInfo(null);
                console.error('Erro ao consultar CEP:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao consultar CEP:', error);
        }
    };
    const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
        const val = e.value || 0;
        let _tutor = { ...tutor };
        _tutor[name] = val;
      
        setTutor(_tutor);
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTutors || !(selectedTutors as Demo.Customer[]).length} />
                </div>
            </React.Fragment>
        );
    };
    
    const nameBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.name}
            </>
        );
    };
    
    const ruaBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Rua</span>
                {rowData.rua}
            </>
        );
    };
    
    const bairroBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Bairro</span>
                {rowData.bairro}
            </>
        );
    };
    
    const numeroBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Número</span>
                {rowData.numero}
            </>
        );
    };
    
    const cidadeBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Cidade</span>
                {rowData.cidade}
            </>
        );
    };
    
    const cepBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">CEP</span>
                {rowData.cep}
            </>
        );
    };
    
    const estadoBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.estado}
            </>
        );
    };
    
    const telefoneBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Telefone</span>
                {rowData.telefone}
            </>
        );
    };
    
    const cpfBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">CPF</span>
                {rowData.cpf}
            </>
        );
    };
    
    const sexoBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Sexo</span>
                {rowData.sexo}
            </>
        );
    };
    
    const actionBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editTutor(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteTutor(rowData)} />
            </>
        );
    };
    

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tutores cadastrados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e?.currentTarget?.value || '')} placeholder="Pesquisar..." />
            </span>
        </div>
    );
    
    const tutorDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveTutor} />
        </>
    );
    
    const deleteTutorDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteTutoresDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteTutor} />
        </>
    );
    
    const deleteTutorsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteTutoresDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedTutors} />
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
                        value={tutores} 
                        selection={selectedTutors}
                        onSelectionChange={(e) => setSelectedTutores(e?.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tutors" 
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum tutor encontrado." 
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Nome" body={nameBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="rua" header="Rua" body={ruaBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="bairro" header="Bairro" body={bairroBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="numero" header="Número" body={numeroBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="cidade" header="Cidade" body={cidadeBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="cep" header="CEP" body={cepBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="estado" header="Estado" body={estadoBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="telefone" header="Telefone" body={telefoneBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="cpf" header="CPF" body={cpfBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column field="sexo" header="Sexo" body={sexoBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
    
                    <Dialog visible={tutorDialog} style={{ width: '450px' }} header="Cadastrar Tutor" modal className="p-fluid" footer={tutorDialogFooter} onHide={hideDialog}>
    
                    <div className="field">
                        <label htmlFor="name">Nome do Tutor</label>
                        <InputText
                            id="name"
                            value={tutor.name}
                            onChange={(e) => onInputChange(e, 'name')}
                            required
                            autoFocus
                            className={classNames({
                                'p-invalid': submitted && !tutor.name
                            })}
                        />
                        {submitted && !tutor.name && <small className="p-invalid">Nome é obrigatório.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="rua">Rua</label>
                        <InputTextarea id="rua" value={tutor.rua} onChange={(e) => onInputChange(e, 'rua')} required rows={3} cols={20} 
                         className={classNames({
                            'p-invalid': submitted && !tutor.rua
                        })}
                    />
                    {submitted && !tutor.rua && <small className="p-invalid">Rua é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="bairro">Bairro</label>
                        <InputText id="bairro" value={cepInfo?.bairro || tutor.bairro} onChange={(e) => onInputChange(e, 'bairro')} required 
                          className={classNames({
                            'p-invalid': submitted && !tutor.bairro
                        })}
                    />
                    {submitted && !tutor.bairro && <small className="p-invalid">Bairro é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="numero">Número</label>
                        <InputNumber id="numero" value={tutor.numero} onChange={(e) => onInputNumberChange(e, 'numero')} required
                          className={classNames({
                            'p-invalid': submitted && !tutor.numero
                        })}
                    />
                    {submitted && !tutor.numero && <small className="p-invalid">Numero é obrigatório.</small>} 
                        </div>
                    <div className="field">
                        <label htmlFor="cidade">Cidade</label>
                        <InputText id="cidade" value={cepInfo?.cidade || tutor.cidade} onChange={(e) => onInputChange(e, 'cidade')} required 
                          className={classNames({
                            'p-invalid': submitted && !tutor.cidade
                        })}
                    />
                    {submitted && !tutor.cidade && <small className="p-invalid">Cidade é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="cep">CEP</label>
                        <InputText id="cep" value={tutor.cep} onChange={(e) => onInputChange(e, 'cep')} required 
                        className={classNames({
                            'p-invalid': submitted && !tutor.cep
                        })}
                    />
                    {submitted && !tutor.cep && <small className="p-invalid">CEP é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="estado">Estado</label>
                        <InputText id="estado" value={cepInfo?.estado || tutor.estado} onChange={(e) => onInputChange(e, 'estado')} required 
                        className={classNames({
                            'p-invalid': submitted && !tutor.estado
                        })}
                    />
                    {submitted && !tutor.estado && <small className="p-invalid">Estado é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="telefone">Telefone</label>
                        <InputText id="telefone" value={tutor.telefone} onChange={(e) => onInputChange(e, 'telefone')} required 
                        className={classNames({
                            'p-invalid': submitted && !tutor.telefone
                        })}
                    />
                    {submitted && !tutor.telefone && <small className="p-invalid">Telefone é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="cpf">CPF</label>
                        <InputText id="cpf" value={tutor.cpf} onChange={(e) => onInputChange(e, 'cpf')} required 
                        className={classNames({
                            'p-invalid': submitted && !tutor.cpf
                        })}
                    />
                    {submitted && !tutor.cpf && <small className="p-invalid">CPF é obrigatório.</small>} 
                    </div>
                    <div className="field">
                        <label htmlFor="sexo">Sexo</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="sexoM" name="sexo" value="M" onChange={onCategoryChange} checked={tutor.sexo === 'M'} />
                                <label htmlFor="sexoM">Masculino</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="sexoF" name="sexo" value="F" onChange={onCategoryChange} checked={tutor.sexo === 'F'} />
                                <label htmlFor="sexoF">Feminino</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton inputId="outro" name="sexo" value="outro" onChange={onCategoryChange} checked={tutor.sexo === 'outro'} />
                                <label htmlFor="outro">Outro</label>
                            </div>
                            </div>
                            {submitted && !tutor.sexo && (
                        <small className="p-invalid">Selecione uma opção de sexo.</small>
            )}
                    </div>
                    </Dialog>

                    <Dialog visible={deleteTutorDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTutorDialogFooter} onHide={hideDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tutor && (
                                <span>
                                    Tem certeza que deseja excluir <b>{tutor.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTutoresDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTutorsDialogFooter} onHide={hideDeleteTutoresDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tutor && <span>Tem certeza que deseja excluir esse tutor?</span>}
                        </div>
                    </Dialog>                    </div>
                    </div>
                    </div>
                    );
};
export default CrudTutores;
