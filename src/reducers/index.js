import {combineReducers} from 'redux';
import app from './app';
import csvImport from './csv-import';
import mapping from './mapping';

export default combineReducers({
    app,
    csvImport,
    mapping
});
