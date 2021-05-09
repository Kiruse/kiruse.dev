//////////////////////////////////////////////////////////////////////
// Homepage
// -----
// Copyright (c) Kiruse 2021. All rights reserved.
import Head from 'next/head'
import Image from 'next/image'
import styles from '@styles/home.module.css'

import Titlebar from '@components/titlebar'
import Content from '@components/content'
import Footer from '@components/footer'
import Grid from '@components/grid'
import Card from '@components/card'

export default function Home() {
	const cardAttrs = {
		newtab: true,
        pale: "#e7d3ff",
        color: "#caafff",
        textColor: "#d83dff",
        textHoverColor: "black",
	};
	
	return (
		<div className={styles.container}>
			<Head>
				<title>kiruse.dev</title>
				<meta name="description" content="The homepage of freelance developer Kiruse!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			
			<Titlebar title="kiruse.dev" subtitle="freelance full stack engineer" />
			
			<Content>
				<h1 className={styles.title}>
				    Hi! Welcome to <span>kiruse.dev!</span>
				</h1>
				
				<div className={[styles.description, styles.content].join(' ')}>
                    <p>
                        My name/pseudonym is <span>Kiruse</span> and I'm a freelance full stack software engineer.
                    </p>
                    <p>
                        For my technology stack, I prefer <span>React (Native)/Electron</span> for frontend, <span>Node.js/Python</span>{' '}
                        for backend, and <span>MySQL/SQLite/CouchDB</span> for database. In fact, I built this website with{' '}
                        <span>React & Node.js</span> and hosted it on <a href="https://www.heroku.com/nodejs">Heroku!</a>
                    </p>
				</div>
				
                <section>
                    <h2>Current Clients</h2>
                    <Grid classes={[styles.content]} columns={2}>
                        <Card link="https://kinsys.de/" {...cardAttrs}>
                            <h2>KINSYS &rarr;</h2>
                            <p>Peak Machine Learning Consulting</p>
                        </Card>
                        
                        <Card link="https://mediprim.com/" {...cardAttrs}>
                            <h2>Mediprim &rarr;</h2>
                            <p>International medical supplies distributor</p>
                        </Card>
                    </Grid>
                </section>
                
                <section>
                    <h2>Projects Showcase</h2>
                    <Grid classes={[styles.content]} columns={3}>
                        <Card link="https://github.com/Kirusifix/ExtraFun.jl" {...cardAttrs}>
                            <h2>ExtraFun.jl</h2>
                            <p>Complementary Julia functions, types, and macros</p>
                        </Card>
                        
                        <Card link="https://github.com/Kiruse/Pia.jl" {...cardAttrs}>
                            <h2>Pia.jl</h2>
                            <p>Modular framework for peer-to-Peer networks & blockchains</p>
                        </Card>
                    </Grid>
                </section>
                
                <section style={{maxWidth: 800, textAlign: 'center'}}>
                    <h2>Publications</h2>
                    <p>
                        I also write some articles over at <a href="https://kiruse.medium.com/">Medium!</a> I primarily
                        focus on &quot;coding snacks&quot; &mdash; little tips & tricks for coders no longer than a few minutes of
                        reading time.
                    </p>
                </section>
			</Content>
			
			<Footer>
				Disclaimer: This website is still under construction.
			</Footer>
		</div>
  	)
}
