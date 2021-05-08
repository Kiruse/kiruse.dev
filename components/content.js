//////////////////////////////////////////////////////////////////////
// Content component
// -----
// Copyright (c) Kiruse 2021. All rights reserved.
import React from 'react'
import styles from '@/styles/content.module.css'

export default function Content({children}) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}
