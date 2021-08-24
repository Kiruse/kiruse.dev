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

window.onload = () => {
  var _pageloads$page;

  const page = (0, _miniquery.default)(d.body).attr('data-page')[0].toLowerCase();
  (_pageloads$page = pageloads[page]) === null || _pageloads$page === void 0 ? void 0 : _pageloads$page.call(pageloads);
  (0, _miniquery.default)(d.body).on('touchend mouseup', function () {
    (0, _miniquery.default)('#navbar a').removeClass('down');
  });
  (0, _miniquery.default)('#navbar a').on('touchstart mousedown', function (e) {
    (0, _miniquery.default)(e.target).addClass('down');
  });
};

const pageloads = {
  home() {
    const $form = (0, _miniquery.default)('#contact-email form');
    const $jobs = (0, _miniquery.default)('#freelance-jobs');
    const $jobspan = (0, _miniquery.default)('#home h2 span');
    $form.style('display', 'block');
    (0, _miniquery.default)('#contact-form-submit').on('click', async e => {
      e.preventDefault(); // TODO: submit form to serverless function using `fetch`
    });
    (0, _miniquery.default)('.qrcode').forEach(async el => {
      const canvas = _miniquery.default.create('canvas').attachTo(el).style('display', 'block');

      await _qrcode.default.toCanvas(canvas[0], (0, _miniquery.default)(el).attr('data-url')[0]);
    });
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

};