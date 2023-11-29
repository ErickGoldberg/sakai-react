/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src="/demo/images/logo.png" alt="Logo" height="120"/>
            by
            <span className="font-medium ml-2">Recife Pet</span>
        </div>
    );
};

export default AppFooter;
