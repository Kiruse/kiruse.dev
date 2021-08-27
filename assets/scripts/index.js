//////////////////////////////////////////////////////////////////////
// home script
// -----
// Copyright (c) Kiruse 2021. Licensed under GPL-3.0
"use strict";

import anime from 'animejs/lib/anime.es'
import QRCode from 'qrcode'
import $ from '@/miniquery'
import errors from '@serverless/errors.json'

const d = document;

$.onready(() => {
    buildNavbar();
    buildButtons();
    buildContactForm();
    buildQRCodes();
    animateJobs();
    animateAbout();
    animateProjects();
});

function buildNavbar() {
    $(d.body).on('touchend mouseup', () => {
        $('#navbar a').removeClass('down');
    });
    $('#navbar a').on('touchstart mousedown', evt => {
        $(evt.target).addClass('down');
    });
}

function buildButtons() {
    $('button').on('mousedown touchstart', evt => $(evt.target).addClass('down'));
    $(d.body).on('mouseup touchend', () => $('button').removeClass('down'));
}

function buildContactForm() {
    const $form = $('#contact-email form');
    $form.style('display', 'block');
    $form.on('submit', async evt => {
        evt.preventDefault();
        const spinner = new Spinner($form[0]).attach();
        let alertparams = {title: 'Mail not sent', type: 'error', message: 'Failed to send mail, apologies. Perhaps attempt via a different channel?'};
        
        try {
            const res = await fetch('https://europe-west1-kirusite-c3392.cloudfunctions.net/sendmail', {
                method: 'post',
                body: new URLSearchParams(new FormData($form[0])),
            });
            
            if (res.status === 200) {
                const json = await res.json();
                if (json.error === errors.mail['malformed address']) {
                    alertparams.message = 'Malformed email address. Please verify you\'ve entered the correct address.';
                }
                else {
                    alertparams = {
                        title: 'Mail sent',
                        type: 'success',
                        message: 'Your message was sent! Typically, I respond within a day.'
                    };
                }
            }
            else {
                console.error('status code', res.status);
            }
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            createAlert(alertparams);
            spinner.detach();
        }
    });
}

function buildQRCodes() {
    $('.qrcode').forEach(async el => {
        const canvas = $.create('canvas').attachTo(el).style('display', 'block');
        await QRCode.toCanvas(canvas[0], $(el).attr('data-url')[0]);
    });
}

function animateJobs() {
    const $jobs = $('#freelance-jobs');
    const $jobspan = $('#home h2 span');
    
    anime({
        targets: $jobspan.elements,
        loop: true,
        direction: 'normal',
        duration: 500,
        keyframes: [
            {
                translateY: [-30, 0],
                opacity: [0, 1],
                easing: 'easeInQuad',
            },
            {
                delay: 2000,
                translateY: [0, 30],
                opacity: [1, 0],
                easing: 'easeOutQuad',
            },
        ],
        loopComplete() {
            const labels = $jobs.query('li');
            let idx = parseInt($jobs.data('curr'));
            if (isNaN(idx))
                idx = 0;
            else
                ++idx;
            
            if (idx >= labels.length) idx = 0;
            $jobs.data('curr', idx);
            $jobspan.text(labels.text()[idx]);
        },
    });
}

function animateAbout() {
    const $about = $('#about');
    const parallaxScroll = (x, y) => $about.style('background-position', `${x}px ${y}px`);
    
    $(d.body).on('touchstart touchmove', evt => parallaxScroll(evt.touches[0].screenX/10, evt.touches[0].screenY/10));
    $(d.body).on('mousemove', evt => parallaxScroll(evt.pageX/10, evt.pageY/10));
}

function animateProjects() {
    $('.project').forEach(el => {
        const animBG = anime({
            targets: $(el).query('.content')[0],
            translateY: [50, 0],
            easing: 'linear',
        });
        const animCnt = anime({
            targets: el,
            opacity: [0, 1],
            easing: 'linear',
        });
        
        function handleScroll() {
            const start = el.offsetTop - window.innerHeight*2/3;
            const stop  = el.offsetTop - window.innerHeight/3;
            const progress = Math.max(0, Math.min(window.scrollY-start, stop)) / (stop-start);
            animCnt.seek(animCnt.duration * progress);
            animBG.seek(animBG.duration * progress);
        }
        $(document).on('scroll', handleScroll);
        handleScroll();
        animCnt.pause();
        animBG.pause();
    });
}

function createAlert({title, type, message}) {
    let $alerts = $('#alerts');
    if (!$alerts.length) {
        $alerts = $.create('div').attr('id', 'alerts').attachTo(d.body);
    }
    
    const $alert = $.create('div').addClass('alert', type || 'info');
    
    const $title = $.create('div')
        .addClass('title')
        .text(title || 'Alert')
        .attachTo($alert);
    $.create('a')
        .addClass('close')
        .attr('href', '#')
        .text('×')
        .on('click', (evt) => {
            evt.preventDefault();
            $alert.detach();
        })
        .attachTo($title);
    
    $.create('div')
        .addClass('body')
        .text(message || '')
        .attachTo($alert);
    $alert.attachTo($alerts);
    return $alert;
}

class Spinner {
    constructor(parent) {
        if (!parent) throw new Error('no parent element');
        this.$parent = $(parent);
        this.$elem   = $.create('div').addClass('overlay', 'spinner');
        
        if (this.$parent.style('position')[0] === 'static') {
            this.$parent.style('position', 'relative');
        }
        
        for (let i = 0; i < 5; ++i) {
            $.create('div').addClass('spinner-dot').attachTo(this.$elem);
        }
        
        this.anim = anime({
            targets: this.$elem.query('.spinner-dot').elements,
            translateY: [0, -25, 0],
            loop: true,
            delay: anime.stagger(100),
            endDelay: 300,
            duration: 500,
            easing: 'easeInOutQuad',
        })
    }
    
    attach() {
        this.$elem.attachTo(this.$parent);
        return this;
    }
    
    detach() {
        this.$elem.detach();
        return this;
    }
}
