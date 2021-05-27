import {combineReducers} from 'redux';
import {DISMISS_ALERT, SET_ALERT, SET_PAGE, SET_ROWS_PER_PAGE, SET_TAB, TABS} from "../constants/app";

const alertSort = (a, b) => a.id - b.id;

export const now = () => new Date().valueOf();

const alerts = (state = [], action) => {
    const {type, alert, id, status, err} = action;
    switch (type) {
    case SET_ALERT:
        if (alert.action) {
            const [existingAlert] = state.filter(a => a.action === alert.action);
            if (existingAlert) {
                existingAlert.count += 1;
            }
            return [
                ...state.filter(a => a.action !== alert.action),
                existingAlert || alert
            ].sort(alertSort);
        }
        return [...state, {...alert, count: 1, id: now()}].sort(alertSort);
    case DISMISS_ALERT:
        return [...state.filter(alert => alert.id !== id)].sort(alertSort);
    default:
        return state;
    }
};

const page = (state = 1, action) => {
    const {type, page, status} = action;
    switch (type) {
    case SET_PAGE:
        return page;
    case SET_ROWS_PER_PAGE:
        return 1;
    default:
        return state;
    }
};

const rowsPerPage = (state = 25, action) => {
    const {type, rowsPerPage} = action;
    switch (type) {
    case SET_ROWS_PER_PAGE:
        return rowsPerPage;
    default:
        return state;
    }
};

const tab =(state = TABS[0].id, action) => {
    const {type, tab} = action;
    switch (type) {
    case SET_TAB:
        return tab;
    default:
        return state;
    }
};


export default combineReducers({
    alerts,
    page,
    rowsPerPage,
    tab,
})
