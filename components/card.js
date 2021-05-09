//////////////////////////////////////////////////////////////////////
// Website Titlebar
// -----
// Copyright (c) Kiruse 2021. All rights reserved.
import React, {useState} from 'react'
import styles from '@styles/card.module.css'

import Color from '@lib/theming'

export default function Card({link, newtab, color, pale, textColor, textHoverColor, children}) {
    color = Color.from(color??'#fff');
    pale  = pale ? Color.from(pale) : color.brighten();
    textColor      = Color.from(textColor??'black');
    textHoverColor = Color.from(textHoverColor??'#d83dff');
    
    const [hover, setHover] = useState(false);
    const attrs = {
        className: styles.container,
        style: {
            backgroundColor: (hover ? color : pale).toHex(),
            color: (hover ? textHoverColor : textColor).toHex(),
        },
        onMouseEnter() {setHover(true)},
        onMouseLeave() {setHover(false)},
    };
    
    if (link) {
        return (
            <a href={link} target={newtab?'_blank':'_top'} className={styles.container} {...attrs}>
                {children}
            </a>
        )
    }
    else {
        return (
            <div className={styles.container} {...attrs}>
                {children}
            </div>
        )
    }
}
