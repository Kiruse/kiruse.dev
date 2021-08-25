//////////////////////////////////////////////////////////////////////
// home script
// -----
// Copyright (c) Kiruse 2021. Licensed under GPL-3.0
"use strict";

var _anime = _interopRequireDefault(require("animejs/lib/anime.es"));

var _qrcode = _interopRequireDefault(require("qrcode"));

var _miniquery = _interopRequireDefault(require("@/miniquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const d = document;

_miniquery.default.onready(() => {
  buildNavbar();
  buildContactForm();
  buildQRCodes();
  animateJobs();
  animateAbout();
});

function buildNavbar() {
  (0, _miniquery.default)(d.body).on('touchend mouseup', () => {
    (0, _miniquery.default)('#navbar a').removeClass('down');
  });
  (0, _miniquery.default)('#navbar a').on('touchstart mousedown', evt => {
    (0, _miniquery.default)(evt.target).addClass('down');
  });
}

function buildContactForm() {
  const $form = (0, _miniquery.default)('#contact-email form');
  $form.style('display', 'block');
  $form.on('submit', evt => {
    evt.preventDefault(); // TODO: submit form to serverless function using `fetch`
  });
}

function buildQRCodes() {
  (0, _miniquery.default)('.qrcode').forEach(async el => {
    const canvas = _miniquery.default.create('canvas').attachTo(el).style('display', 'block');

    await _qrcode.default.toCanvas(canvas[0], (0, _miniquery.default)(el).attr('data-url')[0]);
  });
}

function animateJobs() {
  const $jobs = (0, _miniquery.default)('#freelance-jobs');
  const $jobspan = (0, _miniquery.default)('#home h2 span');
  (0, _anime.default)({
    targets: $jobspan.elements,
    loop: true,
    direction: 'normal',
    duration: 500,
    keyframes: [{
      translateY: [-30, 0],
      opacity: [0, 1],
      easing: 'easeInQuad'
    }, {
      delay: 2000,
      translateY: [0, 30],
      opacity: [1, 0],
      easing: 'easeOutQuad'
    }],

    loopComplete() {
      const labels = $jobs.query('li');
      let idx = parseInt($jobs.data('curr'));
      if (isNaN(idx)) idx = 0;else ++idx;
      if (idx >= labels.length) idx = 0;
      $jobs.data('curr', idx);
      $jobspan.text(labels.text()[idx]);
    }

  });
}

function animateAbout() {
  const $about = (0, _miniquery.default)('#about');

  const parallaxScroll = (x, y) => $about.style('background-position', `${x}px ${y}px`);

  (0, _miniquery.default)(d.body).on('touchstart touchmove', evt => parallaxScroll(evt.touches[0].screenX / 10, evt.touches[0].screenY / 10));
  (0, _miniquery.default)(d.body).on('mousemove', evt => parallaxScroll(evt.pageX / 10, evt.pageY / 10));
}