
let wasm;

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}
function __wbg_elem_binding0(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.__wbg_function_table.get(144)(arg0, arg1, addHeapObject(arg2));
}
function __wbg_elem_binding1(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.__wbg_function_table.get(227)(arg0, arg1);
}
function __wbg_elem_binding2(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.__wbg_function_table.get(148)(arg0, arg1, addHeapObject(arg2));
}
function __wbg_elem_binding3(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    _assertNum(arg2);
    wasm.__wbg_function_table.get(146)(arg0, arg1, arg2);
}
function __wbg_elem_binding4(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.__wbg_function_table.get(255)(arg0, arg1, addHeapObject(arg2));
}
function __wbg_elem_binding5(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.__wbg_function_table.get(288)(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}
/**
*/
export function render() {
    wasm.render();
}

function logError(e) {
    let error = (function () {
        try {
            return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
        } catch(_) {
            return "<failed to stringify thrown value>";
        }
    }());
    console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
    throw e;
}

function getObject(idx) { return heap[idx]; }

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm(arg) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    let len = arg.length;
    let ptr = wasm.__wbindgen_malloc(len);

    const mem = getUint8Memory();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = wasm.__wbindgen_realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read != arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory = null;
function getInt32Memory() {
    if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function init(module) {
    if (typeof module === 'undefined') {
        module = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    let result;
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_initMap_d927505caddfb2b6 = function() {
        try {
            const ret = initMap();
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_setMarker_3adcdbd4433dbfb5 = function(arg0, arg1, arg2, arg3, arg4) {
        const v0 = getStringFromWasm(arg3, arg4).slice();
        wasm.__wbindgen_free(arg3, arg4 * 1);
        try {
            const ret = setMarker(getObject(arg0), arg1, arg2, v0);
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_removeMarker_ec55da2b1b96d54f = function(arg0) {
        try {
            removeMarker(takeObject(arg0));
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_setMapCenter_8dbed77aa29de13a = function(arg0, arg1, arg2) {
        try {
            setMapCenter(getObject(arg0), arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_setMapZoom_12c74e4af7d1ed3c = function(arg0, arg1) {
        try {
            setMapZoom(getObject(arg0), arg1);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_forget = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        const v0 = getStringFromWasm(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 1);
        try {
            console.error(v0);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        try {
            const ret = new Error();
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).stack;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_setTimeout_53c0997134972ce3 = function(arg0, arg1) {
        try {
            const ret = setTimeout(getObject(arg0), arg1);
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_clearTimeout_42a8676f07d366c5 = typeof clearTimeout == 'function' ? clearTimeout : notDefined('clearTimeout');
    imports.wbg.__widl_f_new_AbortController = function() {
        try {
            try {
                const ret = new AbortController();
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_abort_AbortController = function(arg0) {
        try {
            getObject(arg0).abort();
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_signal_AbortController = function(arg0) {
        try {
            const ret = getObject(arg0).signal;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_latitude_Coordinates = function(arg0) {
        try {
            const ret = getObject(arg0).latitude;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_longitude_Coordinates = function(arg0) {
        try {
            const ret = getObject(arg0).longitude;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_create_element_Document = function(arg0, arg1, arg2) {
        try {
            try {
                const ret = getObject(arg0).createElement(getStringFromWasm(arg1, arg2));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_create_element_ns_Document = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            try {
                const ret = getObject(arg0).createElementNS(arg1 === 0 ? undefined : getStringFromWasm(arg1, arg2), getStringFromWasm(arg3, arg4));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_create_text_node_Document = function(arg0, arg1, arg2) {
        try {
            const ret = getObject(arg0).createTextNode(getStringFromWasm(arg1, arg2));
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_get_element_by_id_Document = function(arg0, arg1, arg2) {
        try {
            const ret = getObject(arg0).getElementById(getStringFromWasm(arg1, arg2));
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_Element = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof Element;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_closest_Element = function(arg0, arg1, arg2) {
        try {
            try {
                const ret = getObject(arg0).closest(getStringFromWasm(arg1, arg2));
                return isLikeNone(ret) ? 0 : addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_get_attribute_Element = function(arg0, arg1, arg2, arg3) {
        try {
            const ret = getObject(arg1).getAttribute(getStringFromWasm(arg2, arg3));
            const ptr0 = isLikeNone(ret) ? 0 : passStringToWasm(ret);
            const len0 = WASM_VECTOR_LEN;
            const ret0 = ptr0;
            const ret1 = len0;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_remove_attribute_Element = function(arg0, arg1, arg2) {
        try {
            try {
                getObject(arg0).removeAttribute(getStringFromWasm(arg1, arg2));
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_attribute_Element = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            try {
                getObject(arg0).setAttribute(getStringFromWasm(arg1, arg2), getStringFromWasm(arg3, arg4));
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_tag_name_Element = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).tagName;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_prevent_default_Event = function(arg0) {
        try {
            getObject(arg0).preventDefault();
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_target_Event = function(arg0) {
        try {
            const ret = getObject(arg0).target;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_add_event_listener_with_callback_EventTarget = function(arg0, arg1, arg2, arg3) {
        try {
            try {
                getObject(arg0).addEventListener(getStringFromWasm(arg1, arg2), getObject(arg3));
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_remove_event_listener_with_callback_EventTarget = function(arg0, arg1, arg2, arg3) {
        try {
            try {
                getObject(arg0).removeEventListener(getStringFromWasm(arg1, arg2), getObject(arg3));
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_watch_position_Geolocation = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg0).watchPosition(getObject(arg1));
                _assertNum(ret);
                return ret;
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLButtonElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLButtonElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLButtonElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLButtonElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLDataElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLDataElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLDataElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLDataElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_focus_HTMLElement = function(arg0) {
        try {
            try {
                getObject(arg0).focus();
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLInputElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLInputElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_checked_HTMLInputElement = function(arg0, arg1) {
        try {
            getObject(arg0).checked = arg1 !== 0;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_type_HTMLInputElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).type;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLInputElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLInputElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLLIElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLLIElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLLIElement = function(arg0) {
        try {
            const ret = getObject(arg0).value;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLLIElement = function(arg0, arg1) {
        try {
            getObject(arg0).value = arg1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLMenuItemElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLMenuItemElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_checked_HTMLMenuItemElement = function(arg0, arg1) {
        try {
            getObject(arg0).checked = arg1 !== 0;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLMeterElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLMeterElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLMeterElement = function(arg0) {
        try {
            const ret = getObject(arg0).value;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLMeterElement = function(arg0, arg1) {
        try {
            getObject(arg0).value = arg1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLOptionElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLOptionElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLOptionElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLOptionElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLOutputElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLOutputElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLOutputElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLOutputElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLParamElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLParamElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLParamElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLParamElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLProgressElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLProgressElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLProgressElement = function(arg0) {
        try {
            const ret = getObject(arg0).value;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLProgressElement = function(arg0, arg1) {
        try {
            getObject(arg0).value = arg1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLSelectElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLSelectElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLSelectElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLSelectElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_HTMLTextAreaElement = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof HTMLTextAreaElement;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_value_HTMLTextAreaElement = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).value;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_value_HTMLTextAreaElement = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).value = getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_new_Headers = function() {
        try {
            try {
                const ret = new Headers();
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_append_Headers = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            try {
                getObject(arg0).append(getStringFromWasm(arg1, arg2), getStringFromWasm(arg3, arg4));
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_push_state_with_url_History = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        try {
            try {
                getObject(arg0).pushState(getObject(arg1), getStringFromWasm(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm(arg4, arg5));
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_pathname_Location = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg1).pathname;
                const ret0 = passStringToWasm(ret);
                const ret1 = WASM_VECTOR_LEN;
                getInt32Memory()[arg0 / 4 + 0] = ret0;
                getInt32Memory()[arg0 / 4 + 1] = ret1;
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_search_Location = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg1).search;
                const ret0 = passStringToWasm(ret);
                const ret1 = WASM_VECTOR_LEN;
                getInt32Memory()[arg0 / 4 + 0] = ret0;
                getInt32Memory()[arg0 / 4 + 1] = ret1;
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_hash_Location = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg1).hash;
                const ret0 = passStringToWasm(ret);
                const ret1 = WASM_VECTOR_LEN;
                getInt32Memory()[arg0 / 4 + 0] = ret0;
                getInt32Memory()[arg0 / 4 + 1] = ret1;
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_geolocation_Navigator = function(arg0) {
        try {
            try {
                const ret = getObject(arg0).geolocation;
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_Node = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof Node;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_append_child_Node = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg0).appendChild(getObject(arg1));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_insert_before_Node = function(arg0, arg1, arg2) {
        try {
            try {
                const ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_remove_child_Node = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg0).removeChild(getObject(arg1));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_replace_child_Node = function(arg0, arg1, arg2) {
        try {
            try {
                const ret = getObject(arg0).replaceChild(getObject(arg1), getObject(arg2));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_node_type_Node = function(arg0) {
        try {
            const ret = getObject(arg0).nodeType;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_first_child_Node = function(arg0) {
        try {
            const ret = getObject(arg0).firstChild;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_next_sibling_Node = function(arg0) {
        try {
            const ret = getObject(arg0).nextSibling;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_set_text_content_Node = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).textContent = arg1 === 0 ? undefined : getStringFromWasm(arg1, arg2);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_PopStateEvent = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof PopStateEvent;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_state_PopStateEvent = function(arg0) {
        try {
            const ret = getObject(arg0).state;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_coords_Position = function(arg0) {
        try {
            const ret = getObject(arg0).coords;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_status_Response = function(arg0) {
        try {
            const ret = getObject(arg0).status;
            _assertNum(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_status_text_Response = function(arg0, arg1) {
        try {
            const ret = getObject(arg1).statusText;
            const ret0 = passStringToWasm(ret);
            const ret1 = WASM_VECTOR_LEN;
            getInt32Memory()[arg0 / 4 + 0] = ret0;
            getInt32Memory()[arg0 / 4 + 1] = ret1;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_text_Response = function(arg0) {
        try {
            try {
                const ret = getObject(arg0).text();
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_instanceof_Window = function(arg0) {
        try {
            const ret = getObject(arg0) instanceof Window;
            _assertBoolean(ret);
            return ret;
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_cancel_animation_frame_Window = function(arg0, arg1) {
        try {
            try {
                getObject(arg0).cancelAnimationFrame(arg1);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_request_animation_frame_Window = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
                _assertNum(ret);
                return ret;
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_document_Window = function(arg0) {
        try {
            const ret = getObject(arg0).document;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_location_Window = function(arg0) {
        try {
            const ret = getObject(arg0).location;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_history_Window = function(arg0) {
        try {
            try {
                const ret = getObject(arg0).history;
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_navigator_Window = function(arg0) {
        try {
            const ret = getObject(arg0).navigator;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_fetch_with_str_and_init_Window = function(arg0, arg1, arg2, arg3) {
        try {
            const ret = getObject(arg0).fetch(getStringFromWasm(arg1, arg2), getObject(arg3));
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_error_1_ = function(arg0) {
        try {
            console.error(getObject(arg0));
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__widl_f_log_1_ = function(arg0) {
        try {
            console.log(getObject(arg0));
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_newnoargs_8effd2c0e33a9e83 = function(arg0, arg1) {
        try {
            const ret = new Function(getStringFromWasm(arg0, arg1));
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_call_11f5c018dea16986 = function(arg0, arg1) {
        try {
            try {
                const ret = getObject(arg0).call(getObject(arg1));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_call_0ec43f2615658695 = function(arg0, arg1, arg2) {
        try {
            try {
                const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_new_c0bbb5f4477dd304 = function() {
        try {
            const ret = new Object();
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_new_9951dc76868e804f = function(arg0, arg1) {
        const state0 = {a: arg0, b: arg1};
        const cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_elem_binding5(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        try {
            try {
                const ret = new Promise(cb0);
                return addHeapObject(ret);
            } catch (e) {
                logError(e)
            }
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_60394cbc4f37d275 = function(arg0) {
        try {
            const ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_then_4a3adc894c334499 = function(arg0, arg1) {
        try {
            const ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_then_7ad6b7db7ae2f63f = function(arg0, arg1, arg2) {
        try {
            const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_globalThis_b8da724777cacbb6 = function() {
        try {
            try {
                const ret = globalThis.globalThis;
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_self_78670bf6333531d2 = function() {
        try {
            try {
                const ret = self.self;
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_window_b19864ecbde8d123 = function() {
        try {
            try {
                const ret = window.window;
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbg_global_c6db5ff079ba98ed = function() {
        try {
            try {
                const ret = global.global;
                return addHeapObject(ret);
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg_set_77d708c938c75a57 = function(arg0, arg1, arg2) {
        try {
            try {
                const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
                _assertBoolean(ret);
                return ret;
            } catch (e) {
                handleError(e)
            }
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg0);
        if (typeof(obj) !== 'string') return 0;
        const ptr = passStringToWasm(obj);
        getUint32Memory()[arg1 / 4] = WASM_VECTOR_LEN;
        const ret = ptr;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ret0 = passStringToWasm(ret);
        const ret1 = WASM_VECTOR_LEN;
        getInt32Memory()[arg0 / 4 + 0] = ret0;
        getInt32Memory()[arg0 / 4 + 1] = ret1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper2213 = function(arg0, arg1, arg2) {
        const state = { a: arg0, b: arg1, cnt: 1 };
        const real = (arg0) => {
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return __wbg_elem_binding2(a, state.b, arg0);
            } finally {
                if (--state.cnt === 0) wasm.__wbg_function_table.get(149)(a, state.b);
                else state.a = a;
            }
        }
        ;
        real.original = state;
        try {
            const ret = real;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_closure_wrapper2217 = function(arg0, arg1, arg2) {
        const state = { a: arg0, b: arg1, cnt: 1 };
        const real = (arg0) => {
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return __wbg_elem_binding3(a, state.b, arg0);
            } finally {
                if (--state.cnt === 0) wasm.__wbg_function_table.get(147)(a, state.b);
                else state.a = a;
            }
        }
        ;
        real.original = state;
        try {
            const ret = real;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_closure_wrapper4287 = function(arg0, arg1, arg2) {
        const state = { a: arg0, b: arg1, cnt: 1 };
        const real = () => {
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return __wbg_elem_binding1(a, state.b, );
            } finally {
                if (--state.cnt === 0) wasm.__wbg_function_table.get(228)(a, state.b);
                else state.a = a;
            }
        }
        ;
        real.original = state;
        try {
            const ret = real;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_closure_wrapper2215 = function(arg0, arg1, arg2) {
        const state = { a: arg0, b: arg1, cnt: 1 };
        const real = (arg0) => {
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return __wbg_elem_binding0(a, state.b, arg0);
            } finally {
                if (--state.cnt === 0) wasm.__wbg_function_table.get(145)(a, state.b);
                else state.a = a;
            }
        }
        ;
        real.original = state;
        try {
            const ret = real;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };
    imports.wbg.__wbindgen_closure_wrapper6901 = function(arg0, arg1, arg2) {
        const state = { a: arg0, b: arg1, cnt: 1 };
        const real = (arg0) => {
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return __wbg_elem_binding4(a, state.b, arg0);
            } finally {
                if (--state.cnt === 0) wasm.__wbg_function_table.get(256)(a, state.b);
                else state.a = a;
            }
        }
        ;
        real.original = state;
        try {
            const ret = real;
            return addHeapObject(ret);
        } catch (e) {
            logError(e)
        }
    };

    if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;
        wasm.__wbindgen_start();
        return wasm;
    });
}

export default init;

