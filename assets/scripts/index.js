//////////////////////////////////////////////////////////////////////
// home script
// -----
// Copyright (c) Kiruse 2021. Licensed under GPL-3.0
"use strict";

import anime from 'animejs/lib/anime.es'
import QRCode from 'qrcode'
import $ from '@/miniquery'

const d = document;

$.onready(() => {
    buildNavbar();
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

function buildContactForm() {
    const $form = $('#contact-email form');
    $form.style('display', 'block');
    $form.on('submit', evt => {
        evt.preventDefault();
        // TODO: submit form to serverless function using `fetch`
    })
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
