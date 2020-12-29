// // WordPress dependencies

const { isFunction, isEmpty, has, get, set, unset, pick, keys } = lodash; // , transform, map, cloneDeep
const { registerStore, select, dispatch, useDispatch } = wp.data;
const { apiFetch } = wp;

// Zukit dependencies

const { isNull, requestURL } = wp.zukit.data;

// Internal dependencies

// import { pluginDefaults } from './../assets.js';

// Create and register Zu Contact Form store ----------------------------------]

const ZUCONTACT_STORE = 'zucontact/form';
const fetchKey = 'zucontact_forms';
const formsKey = 'forms';

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
    [formsKey]: {}
};

function formReducer(state = initialState, action) {

    function field(state, name, id) {
        return get(state, [formsKey, name, id], {});
    }

    function shallowClone(state, name = false) {
        if(name) return set(state, [formsKey, name], { ...get(state, [formsKey, name], {}) });
        return set(state, [formsKey], { ...get(state, [formsKey], {}) });
    }

    const { type, name } = action;

    switch(type) {
        case TYPES.ADD_FIELD:
        case TYPES.RENAME_FIELD:
        case TYPES.UPDATE_FIELD:
            shallowClone(state, name);
            break;

        case TYPES.CREATE_FORM:
        case TYPES.PURGE_FORM:
        case TYPES.RENAME_FORM:
            shallowClone(state);
            break;
    }

    switch(type) {
        case TYPES.ADD_FIELD:
            set(state, [formsKey, name, action.id], action.value);
            break;

        case TYPES.REMOVE_FIELD:
            if(has(state, [formsKey, name])) state = shallowClone(state, name);
            unset(state, [formsKey, name, action.id]);
            break;

        case TYPES.RENAME_FIELD:
            unset(state, [formsKey, name, action.previousId]);
            set(state, [formsKey, name, action.id], field(state, name, action.previousId));
            break;

        case TYPES.UPDATE_FIELD:
            if(action.updated === 'type') {
                unset(state, [formsKey, name, action.previousId]);
                set(state, [formsKey, name, action.id], action.value);
            } else {
                let newField = { ...field(state, name, action.id) };
                set(newField, action.updated, get(action.value, action.updated));
                set(state, [formsKey, name, action.id], newField);
            }
            break;

        case TYPES.CREATE_FORM:
            set(state, [formsKey, name], {});
            break;

        case TYPES.PURGE_FORM:
            unset(state, [formsKey, name]);
            break;

        case TYPES.RENAME_FORM:
            set(state, [formsKey, name], get(state, [formsKey, action.previousName]));
            unset(state, [formsKey, action.previousName])
            break;

        case TYPES.PERSIST_FORMS:
            // set(state, [formsKey, action.name, 'saved'], true);
            break;
    }
    // console.log('formReducer ACTIONS:', action);
    // console.log('formReducer:', cloneDeep(state));
    return state;
}

const formActions = {
    updateForm(name, action, value) {
        const params = pick(value, ['id', 'previousId', 'previousName', 'updated', 'template']);
        return {
			type: action,
            name,
			value: pick(value, ['id', 'type', 'required', 'requiredValue']),
            ...params,
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
            console.log('PERSIST:', postId, forms);
        }
    }
}
