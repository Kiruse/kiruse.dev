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
    const page = $(d.body).attr('data-page')[0].toLowerCase();
    pageloads[page]?.();
    
    $(d.body).on('touchend mouseup', function() {
        $('#navbar a').removeClass('down');
    });
    $('#navbar a').on('touchstart mousedown', function(e) {
        $(e.target).addClass('down');
    });
});

const pageloads = {
    home() {
        const $form = $('#contact-email form');
        const $jobs = $('#freelance-jobs');
        const $jobspan = $('#home h2 span');
        
        $form.style('display', 'block');
        $('#contact-form-submit').on('click', async e => {
            e.preventDefault();
            // TODO: submit form to serverless function using `fetch`
        });
        
        $('.qrcode').forEach(async el => {
            const canvas = $.create('canvas').attachTo(el).style('display', 'block');
            await QRCode.toCanvas(canvas[0], $(el).attr('data-url')[0]);
        });
        
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
        })
    }
}
