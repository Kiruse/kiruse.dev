//////////////////////////////////////////////////////////////////////
// Website Titlebar
// -----
// Copyright (c) Kiruse 2021. All rights reserved.
import React from 'react'
import styles from '@/styles/titlebar.module.css'

export default function Titlebar({title, subtitle, color, textColor}) {
    return (
        <div className={styles.titlebar} style={{backgroundColor: color ?? '#a941ff', color: textColor ?? 'white'}}>
            <a href="/"><h1>{title}</h1></a>
            {subtitle && <h2>{subtitle}</h2>}
        </div>
    )
}
