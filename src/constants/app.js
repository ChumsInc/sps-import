export const SET_ALERT = 'SET_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export const SET_PAGE = 'SET_PAGE';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE';

export const SET_TAB = 'SET_TAB';

export const TAB_IMPORT = 'TAB_IMPORT';
export const TAB_MAPPING = 'TAB_MAPPING';
export const TAB_TITLES = {
    [TAB_IMPORT]: 'Import',
    [TAB_MAPPING]: 'Mapping',
};

export const TABS = [
    {id: TAB_IMPORT, title: TAB_TITLES[TAB_IMPORT]},
    {id: TAB_MAPPING, title: TAB_TITLES[TAB_MAPPING]}
];

export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';



