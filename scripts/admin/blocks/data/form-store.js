// WordPress dependencies

const {
    isFunction,
    isPlainObject,
    isEmpty,
    isEqual,
    isUndefined,
    omitBy,
    has,
    get,
    set,
    unset,
    pull,
    pick,
    keys,
    cloneDeep,
} = lodash;
const { registerStore, select, dispatch, useDispatch } = wp.data;
const { apiFetch } = wp;

// Zukit dependencies

const { isNull, requestURL } = wp.zukit.data;

// Internal dependencies

import { pluginDefaults } from './../assets.js';

// Create and register Zu Contact Form store ----------------------------------]

const ZUCONTACT_STORE = 'zucontact/form';
const fetchKey = 'zucontact_forms';
const formsKey = 'forms';
const dirtyKey = 'dirty';
const fieldsKey = 'fields';

export const TYPES = {
    ADD_FIELD: 'ADD_FIELD',
    REMOVE_FIELD: 'REMOVE_FIELD',
    RENAME_FIELD: 'RENAME_FIELD',
    UPDATE_FIELD: 'UPDATE_FIELD',

    CREATE_FORM: 'CREATE_FORM',
    PURGE_FORM: 'PURGE_FORM',
    RENAME_FORM: 'RENAME_FORM',

    PERSIST_FORMS: 'PERSIST_FORMS',
}

const initialState = {
    [formsKey]: get(pluginDefaults, 'store', {}),
    [dirtyKey]: false,
};

// we need this to compare in Reducer if there are changes
let storedForms = cloneDeep(initialState[formsKey]);

const pickAttributes = value => {
    const picked = pick(value, ['id', 'type', 'required', 'requiredValue']);
    return omitBy(picked, isUndefined); // without undefined
}

function formReducer(state = initialState, action) {

    function shallowClone(state, fieldPath = null) {
        if(fieldPath) set(state, fieldPath, { ...get(state, fieldPath, {}) });
        set(state, [formsKey], { ...get(state, [formsKey], {}) });
    }

    function markDirty(state) {
        set(state, [dirtyKey], !isEqual(state[formsKey], storedForms));
    }

    const { type, name, updated, id, value } = action;
    const fieldPath = [formsKey, name, fieldsKey, id];
    const formPath = [formsKey, name];
    const callback = isFunction(value) ? value : () => value;

    switch(type) {
        // do not prepare anything for these cases, they are special
        case TYPES.ADD_FIELD:
        case TYPES.REMOVE_FIELD:
            break;

        case TYPES.RENAME_FIELD:
        case TYPES.UPDATE_FIELD:
            shallowClone(state, fieldPath);
            break;

        case TYPES.CREATE_FORM:
        case TYPES.PURGE_FORM:
        case TYPES.RENAME_FORM:
            shallowClone(state);
            break;
    }

    const prevValue = get(state, id ? fieldPath : formPath, {});

    switch(type) {
        case TYPES.ADD_FIELD: {
            const newField = pickAttributes(callback(prevValue));
            if(!isEqual(prevValue, newField)) {
                shallowClone(state, fieldPath);
                set(state, fieldPath, newField);
            }}
            break;

        case TYPES.REMOVE_FIELD:
            // guard! - if the form was removed before the field
            if(has(state, formPath)) shallowClone(state, fieldPath);
            unset(state, fieldPath);
            break;

        case TYPES.RENAME_FIELD:
            unset(state, fieldPath);
            set(state, [ ...pull(fieldPath, id), callback(id) ], prevValue);
            break;

        case TYPES.UPDATE_FIELD:
            if(updated === 'type') {
                const newValue = pickAttributes(callback(prevValue));
                unset(state, fieldPath);
                set(state, [ ...pull(fieldPath, id), newValue.id ], newValue);
            } else {
                let newField = { ...prevValue, [updated]: callback(prevValue[updated]) };
                set(state, fieldPath, newField);
            }
            break;

        case TYPES.CREATE_FORM:
            set(state, formPath, callback(prevValue) || {});
            break;

        case TYPES.PURGE_FORM:
            unset(state, formPath);
            break;

        case TYPES.RENAME_FORM:
            set(state, [ ...pull(formPath, name), callback(name) ], prevValue);
            unset(state, formPath);
            break;

        case TYPES.PERSIST_FORMS:
            storedForms = cloneDeep(state[formsKey])
            break;
    }

    markDirty(state);
// Zubug.data({ action, updated: get(state, id ? fieldPath : formPath), state });
    return state;
}

const formActions = {
    updateForm(name, action, value) {
        return {
			...(isPlainObject(action) ? action : { type: action }),
            name,
			value: isPlainObject(value) ? pickAttributes(value) : value,
		};
    },
    * persistForms(id, value) {
        const path = requestURL('cuset');
        const values = { id, value };
        const data = { key: fetchKey, keys: keys(values), values: values };
        const result = yield apiFetch({ path, method: 'POST', data });

        return isNull(result) ? undefined : {
            type: TYPES.PERSIST_FORMS,
        };
    },
};

const emptyObject = {};

registerStore(ZUCONTACT_STORE, {
    reducer: formReducer,
    actions: formActions,
    selectors: {
        getDirtyForms(state) {
            const dirty = get(state, dirtyKey, false);
            return dirty ? get(state, formsKey, emptyObject) : null;
        },
    },
    controls: {},
});

// Custom hooks & helpers -----------------------------------------------------]

const getUpdatedForms = () => {
    const { getDirtyForms } = select(ZUCONTACT_STORE);
    const forms = isFunction(getDirtyForms) ? getDirtyForms() : null;
    if(!isFunction(getDirtyForms)) Zubug.info('!getDirtyForms NOT Function');
    return forms;
}

// Custom hook which set Forms data
export const useUpdateForm = () => {
    const { updateForm } = useDispatch(ZUCONTACT_STORE);
    return updateForm;
};

export const persistForms = () => {
    const forms = getUpdatedForms();
    if(forms) {
        const { persistForms: persist } = dispatch(ZUCONTACT_STORE);
        const { getCurrentPostId } = select('core/editor');
        const postId = getCurrentPostId();

        if(postId && isFunction(persist)) {
            persist(postId, isEmpty(forms) ? null : forms);
// Zubug.info('PERSIST', { postId, forms });
        }
    }
}
