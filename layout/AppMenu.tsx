/* eslint-disable @next/next/no-img-element */

import { useContext } from 'react';
import { AppMenuItem } from '../types/types';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Recife Pet',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/pages/dashboard' },
                //TODO: cada um desses cruds devem ser integrados ao firebase.
                //TODO: cada label deve ter um icon diferente (verificar na página de ícones o melhor)
                { label: 'Pet', icon: 'pi pi-fw pi-pencil', to: '/pages/crudPets' },
                { label: 'Tutor', icon: 'pi pi-fw pi-pencil', to: '/pages/crudTutor' },
                { label: 'Serviço', icon: 'pi pi-fw pi-pencil', to: '/pages/crudServico' },
                { label: 'Logout', icon: 'pi pi-fw pi-pencil', to: '/' },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
