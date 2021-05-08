//////////////////////////////////////////////////////////////////////
// Website Titlebar
// -----
// Copyright (c) Kiruse 2021. All rights reserved.

const rxRGB  = /^rgb\(\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s*\)$|rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const rxRGBA = /^rgba\(\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+\/\s+(\d{1,3})\%\s*\)$|^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0\.\d{1,})\s*\)$/;

export default class Color {
    constructor(raw) {
        this.raw = raw;
    }
    
    transform(cb) {
        return new Color(Color.denormalize(...this.normalized().map(cb)));
    }
    
    darken(by = 0.1) {
        return this.transform(c => c-by);
    }
    
    brighten(by = 0.1) {
        return this.transform(c => c+by);
    }
    
    toHex() {
        return '#' + this.comps().splice(0, 3).map(c => c.toString(16).padStart(2, '0')).join('');
    }
    
    toRgb() {
        const comps = this.comps();
        return `rgb(${comps[0]}, ${comps[1]}, ${comps[2]})`;
    }
    
    toRgba() {
        const comps = this.comps();
        return `rgba(${comps[0]}, ${comps[1]}, ${comps[2]}, ${comps[3]/0xFF})`;
    }
    
    comps() {
        return [
            this.raw>>24,
            this.raw>>16,
            this.raw>> 8,
            this.raw
        ].map(c => c&0xFF);
    }
    
    normalized() {
        return this.comps().map(c => clamp(0, c/0xFF, 1));
    }
    
    static from(color) {
        if (color instanceof Color) {
            return color;
        }
        
        if (typeof(color) === 'number') {
            return new Color(color);
        }
        
        if (typeof(color) !== 'string') throw new Error('invalid color format');
        
        if (color.startsWith('#')) {
            if (!color.match(/^#[0-9a-fA-F]{3,4}$|^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{8}$/)) {
                throw new Error('invalid hex format');
            }
            
            if (color.length === 4) {
                return new Color(parseInt(duplicateChars(color.substr(1)) + 'ff', 16));
            }
            if (color.length === 5) {
                return new Color(parseInt(duplicateChars(color.substr(1)), 16));
            }
            if (color.length === 7) {
                return new Color(parseInt(color.substr(1) + 'ff', 16))
            }
            return new Color(parseInt(color.substr(1), 16));
        }
        
        let m = color.match(rxRGB);
        if (m) {
            const um = [m[1]??m[4], m[2]??m[5], m[3]??m[6]];
            return new Color(um[0] << 24 | um[1] << 16 | um[2] << 8 | 0xFF);
        }
        
        m = color.match(rxRGBA);
        if (m) {
            const um = [m[1]??m[5], m[2]??m[6], m[3]??m[7], m[4]??m[8]];
            const alpha = clamp(0, um[3].indexOf('.') === -1 ? parseInt(um[3])/100 : parseFloat(um[3]), 1) * 0xFF;
            return new Color(um[0] << 24 | um[1] << 16 | um[2] << 8 | alpha);
        }
        
        if (color in colormap) {
            return Color.from(colormap[color]);
        }
        
        throw new Error('invalid color format');
    }
    
    static denormalize(r, g, b, a = 1) {
        [r, g, b, a] = [r, g, b, a].map(c => clamp(0, c, 1) * 0xFF);
        return r<<24 | g<<16 | b<<8 | a;
    }
}

export function extractColorComponents(color) {
    color = normalizeColor(color);
    const numeric = parseInt(color.substr(1), 16);
    const result = [
        ((numeric >> 24) & 0xF) / 0xF,
        ((numeric >> 16) & 0xF) / 0xF,
        ((numeric >>  8) & 0xF) / 0xF,
    ]
    return result;
}

export function extractAlphaComponent(color) {
    color = normalizeColor(color);
    const numeric = parseInt(color.substr(1));
    return (numeric & 0xF) / 255;
}

export function composeColor(r, g, b, a) {
    const comps = [r, g, b, a].map(c => Math.floor(clamp(0, c, 1) * 255).toString(16));
    console.log(comps.map(c => c.padStart(2, '0')));
    return '#' + comps.join('');
}

function applyColorTransform(color, cb) {
    const comps = extractColorComponents(color);
    const alpha = extractAlphaComponent(color);
    return composeColor(...comps.map(c => cb(c)), alpha);
}

function duplicateChars(str) {
    let result = '';
    for (let c of str) {
        result += c + c;
    }
    return result;
}

const clamp = (min, value, max) => Math.max(min, Math.min(value, max));


const colormap = Object.freeze({
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#0ff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000',
    blanchedalmond: '#ffebcd',
    blue: '#00f',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#0ff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#f0f',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    grey: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgrey: '#d3d3d3',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#0f0',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#f0f',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#639',
    red: '#f00',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#fff',
    whitesmoke: '#f5f5f5',
    yellow: '#ff0',
    yellowgreen: '#9acd32',
})
