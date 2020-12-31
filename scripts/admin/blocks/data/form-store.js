// // WordPress dependencies

const { isFunction, isPlainObject, isEmpty, has, get, set, unset, pull, pick, keys} = lodash;
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
};

function formReducer(state = initialState, action) {

    function shallowClone(state, fieldPath = null) {
        if(fieldPath) set(state, fieldPath, { ...get(state, fieldPath, {}) });
        set(state, [formsKey], { ...get(state, [formsKey], {}) });
    }

    const { type, name, updated, id, value } = action;
    const fieldPath = [formsKey, name, fieldsKey, id];
    const formPath = [formsKey, name];
    const callback = isFunction(value) ? value : () => value;

    switch(type) {
        case TYPES.ADD_FIELD:
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
        case TYPES.ADD_FIELD:
            set(state, fieldPath, callback(prevValue));
            break;

        case TYPES.REMOVE_FIELD:
            // guard! - if the form was removed before the field
            if(has(state, formPath)) state = shallowClone(state, fieldPath);
            unset(state, fieldPath);
            break;

        case TYPES.RENAME_FIELD:
            unset(state, fieldPath);
            set(state, [ ...pull(fieldPath, id), callback(id) ], prevValue);
            break;

        case TYPES.UPDATE_FIELD:
            if(updated === 'type') {
                const newValue = callback(prevValue);
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
            // set(state, [formsKey, action.name, 'saved'], true);
            break;
    }

    Zubug.data({ action, updated: get(state, id ? fieldPath : formPath) });
    return state;
}

const formActions = {
    updateForm(name, action, value) {
        return {
			...(isPlainObject(action) ? action : { type: action }),
            name,
			value: isPlainObject(value) ? pick(value, ['id', 'type', 'required', 'requiredValue']) : value,
		};
    },
    * persistForms(id, value) {
        const path = requestURL('cuset');
        const values = { id, value };
        const data = { key: fetchKey, keys: keys(values), values: values };
        const result = yield apiFetch({ path, method: 'POST', data });

        return isNull(result) ? undefined : {
            type: TYPES.PERSIST_FORMS,
            name,
        };
    },
};

registerStore(ZUCONTACT_STORE, {
    reducer: formReducer,
    actions: formActions,
    selectors: {
        getForms(state) {
            return get(state, formsKey, {});
        },
    },
    controls: {},
});

// const emptyArray = [];
// const emptyObject = {};

// Custom hooks & helpers -----------------------------------------------------]

export const getForms = (name = null) => {
    const { getForms } = select(ZUCONTACT_STORE);
    const forms = isFunction(getForms) ? getForms() : null;
    return name ? get(forms, name, null) : forms;
}

// Custom hook which set Forms data
export const useUpdateForm = () => {
    const { updateForm } = useDispatch(ZUCONTACT_STORE);
    return updateForm;
};

export const persistForms = () => {
    const forms = getForms();
    if(forms) {
        const { persistForms: persist } = dispatch(ZUCONTACT_STORE);
        const { getCurrentPostId } = select('core/editor');
        const postId = getCurrentPostId();

        if(postId && isFunction(persist)) {
            persist(postId, isEmpty(forms) ? null : forms);
            Zubug.info('PERSIST', { postId, forms });
        }
    }
}
