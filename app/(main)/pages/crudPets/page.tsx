/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState, useContext} from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '../../../../types/types';
import { Calendar } from 'primereact/calendar';
import { CalendarChangeEvent } from 'primereact/calendar';
import {format, set} from 'date-fns';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, DocumentData } from "firebase/firestore";
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
  
  const CrudPets = () => {
    const emptyProduct: Demo.Product = {
      id: '',
      name: '',
      especie: '',
      idade: 0,
      date: '',
      peso: 0,
      quantity: 0,
      cor: '',
      sexo: 'M'
    };
  
    const [products, setProducts] = useState<Demo.Product[] | null>(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Demo.Product[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await ProductService.getProducts();
          setProducts(response);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const openNew = () => {
      setProduct(emptyProduct);
      setSubmitted(false);
      setProductDialog(true);
    };
  
    const hideDialog = () => {
      setSubmitted(false);
      setProductDialog(false);
    };
  
    const hideDeleteProductDialog = () => {
      setDeleteProductDialog(false);
    };
  
    const hideDeleteProductsDialog = () => {
      setDeleteProductsDialog(false);
    };
  
    const saveProduct = async () => {
      setSubmitted(true);
  
      if (product.name.trim() && product.especie.trim() && product.date) {
        const db = getFirestore();
        let _product = { ...product };
  
        if (product.id) {
          const productRef = doc(db, "products", product.id);
          await setDoc(productRef, _product);
        } else {
          const productsRef = collection(db, "products");
          const newProductRef = doc(productsRef);
          const newProductId = newProductRef.id;
  
          const newPetData = { ..._product, id: newProductId };
          await setDoc(newProductRef, newPetData);
        }
  
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: product.id ? "Product Updated" : "Product Created",
          life: 3000,
        });
  
        setProductDialog(false);
        setProduct(emptyProduct);
      }
    };
  
    const deleteProduct = async () => {
      const db = getDatabase();
      const productRef = ref(db, `products/${product.id}`);
      await remove(productRef);
  
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
  
      setDeleteProductDialog(false);
      setProduct(emptyProduct);
    };
  
    const confirmDeleteSelected = () => {
      setDeleteProductsDialog(true);
    };
  
    const deleteSelectedProducts = async () => {
      const db = getDatabase();
      const productsRef = ref(db, "products");
  
      for (const selectedProduct of (selectedProducts || []) as Demo.Product[]) {
        if (selectedProduct && selectedProduct.id) {
          const productRef = ref(db, `products/${selectedProduct.id}`);
          await remove(productRef);
        }
      }
  
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
  
      setDeleteProductsDialog(false);
      setSelectedProducts(null);
    };
  
    const onCategoryChange = (e: RadioButtonChangeEvent) => {
      let _product = { ...product };
      _product['sexo'] = e.value;
      setProduct(_product);
    };
  
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
      const val = e.target?.value || '';
      let _product = { ...product };
      _product[`${name}`] = val;
  
      setProduct(_product);
    };
  
    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
      const val = (e && e.value) || 0;
      let _product = { ...product };
      _product[`${name}`] = val;
  
      setProduct(_product);
    };
  
    const onDateChange = (e: CalendarChangeEvent, name: string) => {
      const val = e.value instanceof Date ? format(e.value, 'dd/MM/yy') : '';
      let _product = { ...product };
      _product[`${name}`] = val;
      setProduct(_product);
    };
  
    const rightToolbarTemplate = () => {
      return (
        <React.Fragment>
          <div className="my-2">
            <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
          </div>
        </React.Fragment>
      );
    };
  
    const nameBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Nome</span>
          {rowData.name}
        </>
      );
    };
  
    const especieBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Raça</span>
          {rowData.especie}
        </>
      );
    };
  
    const idadeBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Idade</span>
          {rowData.idade}
        </>
      );
    };
  
    const dateBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Data de Nascimento</span>
          {rowData.date}
        </>
      );
    };
  
    const pesoBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Peso</span>
          {rowData.peso}
        </>
      );
    };
    const corBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Cor</span>
          {rowData.cor}
        </>
      );
    };
    const sexoBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <span className="p-column-title">Sexo</span>
          {rowData.sexo}
        </>
      );
    };
  
    const actionBodyTemplate = (rowData: Demo.Product) => {
      return (
        <>
          <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => setProduct(rowData)} />
          <Button icon="pi pi-trash" rounded severity="warning" onClick={() => setDeleteProductDialog(true)} />
        </>
      );
    };
  
    const header = (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Pets cadastrados</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setGlobalFilter(e?.currentTarget?.value || '')} placeholder="Search..." />
        </span>
      </div>
    );
  
    const productDialogFooter = (
      <>
        <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
        <Button label="Salvar" icon="pi pi-check" text onClick={saveProduct} />
      </>
    );
    const deleteProductDialogFooter = (
      <>
        <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
        <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
      </>
    );
    const deleteProductsDialogFooter = (
      <>
        <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
        <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
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
              value={products}
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e?.value as any)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              globalFilter={globalFilter}
              emptyMessage="No products found."
              header={header}
              responsiveLayout="scroll"
            >
              <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
              <Column field="name" header="Nome" body={nameBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
              <Column field="especie" header="Especie" body={especieBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
              <Column field="idade" header="Idade" body={idadeBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
              <Column field="date" header="Data de Nascimento" body={dateBodyTemplate}></Column>
              <Column field="peso" header="Peso" body={pesoBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
              <Column field="cor" header="Cor" body={corBodyTemplate}></Column>
              <Column field="sexo" header="Sexo" body={sexoBodyTemplate}></Column>
              <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            </DataTable>
  
            <Dialog visible={productDialog} style={{ width: '450px' }} header="Cadastrar pets" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
  
              <div className="field">
                <label htmlFor="name">Nome do pet</label>
                <InputText
                  id="name"
                  value={product.name}
                  onChange={(e) => onInputChange(e, 'name')}
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.name
                  })}
                />
                {submitted && !product.name && <small className="p-invalid">Nome é obrigatório.</small>}
              </div>
              <div className="field">
                <label htmlFor="especie">Raça</label>
                <InputText id="especie" value={product.especie} onChange={(e) => onInputChange(e, 'especie')} required 
                 className={classNames({
                  'p-invalid': submitted && !product.especie
                })}
              />
              {submitted && !product.especie && <small className="p-invalid">Raça é obrigatória.</small>}
              </div>
              <div className="field col">
                <label htmlFor="idade">Idade</label>
                <InputNumber
                  id="idade"
                  value={product.idade}
                  onValueChange={(e) => onInputNumberChange(e, 'idade')}
                  required
                  className={classNames({
                    'p-invalid': submitted && !product.idade
                  })}
                />
                {submitted && !product.idade && <small className="p-invalid">Idade é obrigatória.</small>}
          
              </div>
              <div className="field">
                <label htmlFor="date">Data de Nascimento</label>
                <Calendar
                  id="date"
                  value={product.date ? new Date(product.date) : null}
                  onChange={(e) => onDateChange(e, 'date')}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className={classNames({
                    'p-invalid': submitted && !product.date
                  })}
                />
                {submitted && !product.date && <small className="p-invalid">Data de Nascimento é obrigatória.</small>}
              </div>

              <div className="field col">
                <label htmlFor="peso">Peso</label>
                <InputNumber
                    id="peso"
                    value={product.peso}
                    onValueChange={(e) => onInputNumberChange(e, 'peso')}
                    className={classNames({
                        'p-invalid': submitted && (product.peso <= 0 || product.peso > 100)
                    })}
                />
                {submitted && (product.peso <= 0 || product.peso > 100) && (
                    <small className="p-invalid">O peso deve ser maior que 0 e menor ou igual a 100.</small>
                )}
             </div>

             <div className="field">
                <label htmlFor="cor">Cor</label>
                <InputText
                    id="cor"
                    value={product.cor}
                    onChange={(e) => onInputChange(e, 'cor')}
                    className={classNames({
                        'p-invalid': submitted && !product.cor
                    })}
                />
                {submitted && !product.cor && (
                    <small className="p-invalid">A cor é obrigatória.</small>
                )}
             </div>


            <div className="field">
                <label className="mb-3">Sexo:</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="masculino"
                            name="sexo"
                            value="M"
                            onChange={onCategoryChange}
                            checked={product.sexo === 'M'}
                        />
                        <label htmlFor="masculino">Masculino</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="feminino"
                            name="sexo"
                            value="F"
                            onChange={onCategoryChange}
                            checked={product.sexo === 'F'}
                        />
                        <label htmlFor="feminino">Feminino</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="outro"
                            name="sexo"
                            value="outro"
                            onChange={onCategoryChange}
                            checked={product.sexo === 'outro'}
                        />
                        <label htmlFor="outro">Outro</label>
                    </div>
                </div>
            {submitted && !product.sexo && (
                <small className="p-invalid">Selecione uma opção de sexo.</small>
            )}
            </div>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Tem certeza que deseja excluir <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Tem certeza que deseja excluir esse pet?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CrudPets;