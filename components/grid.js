//////////////////////////////////////////////////////////////////////
// Website Titlebar
// -----
// Copyright (c) Kiruse 2021. All rights reserved.
import React from 'react'
import styles from '@styles/grid.module.css'

export default function Grid({columns, classes, children}) {
    classes = classes ?? [];
    
    const wrappedChildren = [];
    const width = 100/(columns??1);
    
    for (let i in children) {
        const child = children[i];
        wrappedChildren.push(<div key={i} style={{width: `${width}%`}}>{child}</div>)
    }
    
    return (
        <div className={[styles.container, ...classes].join(' ')}>
            {wrappedChildren}
        </div>
    )
}
