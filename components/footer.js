//////////////////////////////////////////////////////////////////////
// Website Titlebar
// -----
// Copyright (c) Kiruse 2021. All rights reserved.
import React from 'react'
import styles from '@/styles/footer.module.css'

export default function Footer({children}) {
    return (
        <footer className={styles.pageFooter}>
            {children}
        </footer>
    )
}
