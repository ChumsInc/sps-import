import {DISMISS_ALERT, SET_ALERT, SET_PAGE, SET_ROWS_PER_PAGE, SET_TAB} from "../constants/app";


export const errorAlert = (err, action) => ({type: 'danger', alert: {title: err.name, message: err.message, count: 1, action}});

export const setAlert = ({type = 'warning', title = 'Oops!', message = 'There was an error', action}) => ({
    type: SET_ALERT,
    alert: {type, title, message, action, count: 1}
});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});

export const setPage = (page) => ({type: SET_PAGE, page});
export const setRowsPerPage = (rowsPerPage) => ({type: SET_ROWS_PER_PAGE, rowsPerPage});

export const setTab = (tab) => ({type: SET_TAB, tab});
