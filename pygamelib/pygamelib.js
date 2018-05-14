var PygameLib = {};

PygameLib.init = function (baseURL) {
    Sk.externalLibraries = Sk.externalLibraries || {};
    var pygame_modules = {
        'pygame.display': {
            path: baseURL + '/display.js'
        },
        'pygame.event': {
            path: baseURL + '/event.js'
        },
        'pygame': {
            path: baseURL + '/pygame.js',
        }
    };
    for (var k in pygame_modules) {
        Sk.externalLibraries[k] = pygame_modules[k];
    }
}

// pygame module

function pygame_init() {
    // ovo je mi me izgleda najelegantnije, ali još nisam našao lepšti način 
    var display_m = Sk.importModule("pygame.display", false, false);
    var evant_m = Sk.importModule("pygame.event", false, false);
    var pygame_m = Sk.importModule("pygame", false, false);
    pygame_m.$d['display'] = display_m.$d['display'];
    pygame_m.$d['event'] = display_m.$d['event'];

    // testiranja radi stavili smo nešto u queue na početku
    PygameLib.eventQueue = [
        [PygameLib.constants.KEYDOWN, {'key':PygameLib.constants.K_SPACE}],
        [PygameLib.constants.QUIT, {'key':''}]
    ];
}

PygameLib.pygame_module = function (name) {
    var mod = PygameLib.constants;
    mod.init = new Sk.builtin.func(pygame_init);
    return mod;
}


// pygame.display module

PygameLib.display_module = function (name) {
    var mod = {};
    mod.set_mode = new Sk.builtin.func(function (resolution) {
    });
    return mod;
}

// pygame.event module


function event_get() {
    var list = [];
    var t,d;
    while((event = PygameLib.eventQueue.pop())!== undefined) {
        var type = Sk.ffi.remapToJs(event[0]);
        var dictjs =event[1];
        kvs = [];
        for (k in dictjs) {
            kvs.push(Sk.ffi.remapToPy(k));
            kvs.push(Sk.ffi.remapToPy(dictjs[k]));
        }
        var dict = new Sk.builtin.dict(kvs);
        var e = Sk.misceval.callsim(PygameLib.EventType, type, dict);
        list.push(e);
    }
    return new Sk.builtin.list(list);
}

function event_EventType_f($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self,type,dict) {
        Sk.builtin.pyCheckArgs('__init__', arguments, 2, 3, false, false);
        dict = dict || new Sk.builtin.dict();
        Sk.abstr.sattr(self, 'dict', dict, false);
        Sk.abstr.sattr(self, 'type', type, false);
        dictjs = Sk.ffi.remapToJs(dict); 
        for(k in dictjs) {
            Sk.abstr.sattr(self, k, Sk.ffi.remapToPy(dictjs[k]), false);
        }
        return Sk.builtin.none.none$;
    });
    $loc.__init__.co_name = new Sk.builtins['str']('__init__');
    $loc.__init__.co_varnames = ['self', 'type', 'dict'];

    $loc.__repr__ = new Sk.builtin.func(function(self) {
        var dict = Sk.ffi.remapToJs(Sk.abstr.gattr(self, 'dict', false)['$r']());
        var type = Sk.ffi.remapToJs(Sk.abstr.gattr(self, 'type', false)['$r']());
        return Sk.ffi.remapToPy('<Event(' + typev + ' ' + dict + ')>');
    });
    $loc.__repr__.co_name = new Sk.builtins['str']('__repr__');
    $loc.__repr__.co_varnames = ['self'];

}



PygameLib.event_module = function (name) {
    var mod = {};
    mod.get = new Sk.builtin.func(event_get);
    mod.EventType = Sk.misceval.buildClass(mod, event_EventType_f, "EventType",[]);
    PygameLib.EventType = mod.EventType;
    mod.Event = new Sk.builtin.func(function(type,dict) {
        return Sk.misceval.callsim(mod.EventType, type,dict)
    });
    return mod;
}

// constants

PygameLib.constants = {
    'ACTIVEEVENT': 1,
    'ANYFORMAT': 268435456,
    'ASYNCBLIT': 4,
    'AUDIO_S16': 32784,
    'AUDIO_S16LSB': 32784,
    'AUDIO_S16MSB': 36880,
    'AUDIO_S16SYS': 32784,
    'AUDIO_S8': 32776,
    'AUDIO_U16': 16,
    'AUDIO_U16LSB': 16,
    'AUDIO_U16MSB': 4112,
    'AUDIO_U16SYS': 16,
    'AUDIO_U8': 8,
    'BIG_ENDIAN': 4321,
    'BLEND_ADD': 1,
    'BLEND_MAX': 5,
    'BLEND_MIN': 4,
    'BLEND_MULT': 3,
    'BLEND_PREMULTIPLIED': 17,
    'BLEND_RGBA_ADD': 6,
    'BLEND_RGBA_MAX': 16,
    'BLEND_RGBA_MIN': 9,
    'BLEND_RGBA_MULT': 8,
    'BLEND_RGBA_SUB': 7,
    'BLEND_RGB_ADD': 1,
    'BLEND_RGB_MAX': 5,
    'BLEND_RGB_MIN': 4,
    'BLEND_RGB_MULT': 3,
    'BLEND_RGB_SUB': 2,
    'BLEND_SUB': 2,
    'BUTTON_X1': 6,
    'BUTTON_X2': 7,
    'DOUBLEBUF': 1073741824,
    'FULLSCREEN': -2147483648,
    'GL_ACCELERATED_VISUAL': 15,
    'GL_ACCUM_ALPHA_SIZE': 11,
    'GL_ACCUM_BLUE_SIZE': 10,
    'GL_ACCUM_GREEN_SIZE': 9,
    'GL_ACCUM_RED_SIZE': 8,
    'GL_ALPHA_SIZE': 3,
    'GL_BLUE_SIZE': 2,
    'GL_BUFFER_SIZE': 4,
    'GL_DEPTH_SIZE': 6,
    'GL_DOUBLEBUFFER': 5,
    'GL_GREEN_SIZE': 1,
    'GL_MULTISAMPLEBUFFERS': 13,
    'GL_MULTISAMPLESAMPLES': 14,
    'GL_RED_SIZE': 0,
    'GL_STENCIL_SIZE': 7,
    'GL_STEREO': 12,
    'GL_SWAP_CONTROL': 16,
    'HAT_CENTERED': 0,
    'HAT_DOWN': 4,
    'HAT_LEFT': 8,
    'HAT_LEFTDOWN': 12,
    'HAT_LEFTUP': 9,
    'HAT_RIGHT': 2,
    'HAT_RIGHTDOWN': 6,
    'HAT_RIGHTUP': 3,
    'HAT_UP': 1,
    'HAVE_NEWBUF': 1,
    'HWACCEL': 256,
    'HWPALETTE': 536870912,
    'HWSURFACE': 1,
    'IYUV_OVERLAY': 1448433993,
    'JOYAXISMOTION': 7,
    'JOYBALLMOTION': 8,
    'JOYBUTTONDOWN': 10,
    'JOYBUTTONUP': 11,
    'JOYHATMOTION': 9,
    'KEYDOWN': 2,
    'KEYUP': 3,
    'KMOD_ALT': 768,
    'KMOD_CAPS': 8192,
    'KMOD_CTRL': 192,
    'KMOD_LALT': 256,
    'KMOD_LCTRL': 64,
    'KMOD_LMETA': 1024,
    'KMOD_LSHIFT': 1,
    'KMOD_META': 3072,
    'KMOD_MODE': 16384,
    'KMOD_NONE': 0,
    'KMOD_NUM': 4096,
    'KMOD_RALT': 512,
    'KMOD_RCTRL': 128,
    'KMOD_RMETA': 2048,
    'KMOD_RSHIFT': 2,
    'KMOD_SHIFT': 3,
    'K_0': 48,
    'K_1': 49,
    'K_2': 50,
    'K_3': 51,
    'K_4': 52,
    'K_5': 53,
    'K_6': 54,
    'K_7': 55,
    'K_8': 56,
    'K_9': 57,
    'K_AMPERSAND': 38,
    'K_ASTERISK': 42,
    'K_AT': 64,
    'K_BACKQUOTE': 96,
    'K_BACKSLASH': 92,
    'K_BACKSPACE': 8,
    'K_BREAK': 318,
    'K_CAPSLOCK': 301,
    'K_CARET': 94,
    'K_CLEAR': 12,
    'K_COLON': 58,
    'K_COMMA': 44,
    'K_DELETE': 127,
    'K_DOLLAR': 36,
    'K_DOWN': 274,
    'K_END': 279,
    'K_EQUALS': 61,
    'K_ESCAPE': 27,
    'K_EURO': 321,
    'K_EXCLAIM': 33,
    'K_F1': 282,
    'K_F10': 291,
    'K_F11': 292,
    'K_F12': 293,
    'K_F13': 294,
    'K_F14': 295,
    'K_F15': 296,
    'K_F2': 283,
    'K_F3': 284,
    'K_F4': 285,
    'K_F5': 286,
    'K_F6': 287,
    'K_F7': 288,
    'K_F8': 289,
    'K_F9': 290,
    'K_FIRST': 0,
    'K_GREATER': 62,
    'K_HASH': 35,
    'K_HELP': 315,
    'K_HOME': 278,
    'K_INSERT': 277,
    'K_KP0': 256,
    'K_KP1': 257,
    'K_KP2': 258,
    'K_KP3': 259,
    'K_KP4': 260,
    'K_KP5': 261,
    'K_KP6': 262,
    'K_KP7': 263,
    'K_KP8': 264,
    'K_KP9': 265,
    'K_KP_DIVIDE': 267,
    'K_KP_ENTER': 271,
    'K_KP_EQUALS': 272,
    'K_KP_MINUS': 269,
    'K_KP_MULTIPLY': 268,
    'K_KP_PERIOD': 266,
    'K_KP_PLUS': 270,
    'K_LALT': 308,
    'K_LAST': 323,
    'K_LCTRL': 306,
    'K_LEFT': 276,
    'K_LEFTBRACKET': 91,
    'K_LEFTPAREN': 40,
    'K_LESS': 60,
    'K_LMETA': 310,
    'K_LSHIFT': 304,
    'K_LSUPER': 311,
    'K_MENU': 319,
    'K_MINUS': 45,
    'K_MODE': 313,
    'K_NUMLOCK': 300,
    'K_PAGEDOWN': 281,
    'K_PAGEUP': 280,
    'K_PAUSE': 19,
    'K_PERIOD': 46,
    'K_PLUS': 43,
    'K_POWER': 320,
    'K_PRINT': 316,
    'K_QUESTION': 63,
    'K_QUOTE': 39,
    'K_QUOTEDBL': 34,
    'K_RALT': 307,
    'K_RCTRL': 305,
    'K_RETURN': 13,
    'K_RIGHT': 275,
    'K_RIGHTBRACKET': 93,
    'K_RIGHTPAREN': 41,
    'K_RMETA': 309,
    'K_RSHIFT': 303,
    'K_RSUPER': 312,
    'K_SCROLLOCK': 302,
    'K_SEMICOLON': 59,
    'K_SLASH': 47,
    'K_SPACE': 32,
    'K_SYSREQ': 317,
    'K_TAB': 9,
    'K_UNDERSCORE': 95,
    'K_UNKNOWN': 0,
    'K_UP': 273,
    'K_a': 97,
    'K_b': 98,
    'K_c': 99,
    'K_d': 100,
    'K_e': 101,
    'K_f': 102,
    'K_g': 103,
    'K_h': 104,
    'K_i': 105,
    'K_j': 106,
    'K_k': 107,
    'K_l': 108,
    'K_m': 109,
    'K_n': 110,
    'K_o': 111,
    'K_p': 112,
    'K_q': 113,
    'K_r': 114,
    'K_s': 115,
    'K_t': 116,
    'K_u': 117,
    'K_v': 118,
    'K_w': 119,
    'K_x': 120,
    'K_y': 121,
    'K_z': 122,
    'LIL_ENDIAN': 1234,
    'MOUSEBUTTONDOWN': 5,
    'MOUSEBUTTONUP': 6,
    'MOUSEMOTION': 4,
    'NOEVENT': 0,
    'NOFRAME': 32,
    'NUMEVENTS': 32,
    'OPENGL': 2,
    'OPENGLBLIT': 10,
    'PREALLOC': 16777216,
    'QUIT': 12,
    'RESIZABLE': 16,
    'RLEACCEL': 16384,
    'RLEACCELOK': 8192,
    'SCRAP_BMP': 'image/bmp',
    'SCRAP_CLIPBOARD': 0,
    'SCRAP_PBM': 'image/pbm',
    'SCRAP_PPM': 'image/ppm',
    'SCRAP_SELECTION': 1,
    'SCRAP_TEXT': 'text/plain',
    'SRCALPHA': 65536,
    'SRCCOLORKEY': 4096,
    'SWSURFACE': 0,
    'SYSWMEVENT': 13,
    'TIMER_RESOLUTION': 10,
    'USEREVENT': 24,
    'USEREVENT_DROPFILE': 4096,
    'UYVY_OVERLAY': 1498831189,
    'VIDEOEXPOSE': 17,
    'VIDEORESIZE': 16,
    'YUY2_OVERLAY': 844715353,
    'YV12_OVERLAY': 842094169,
    'YVYU_OVERLAY': 1431918169
}