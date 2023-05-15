import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {loadVersion, selectVersion} from "./index";
import {Alert} from "chums-components";

const VersionInfo = () => {
    const dispatch = useAppDispatch();
    const version = useAppSelector(selectVersion);

    useEffect(() => {
        dispatch(loadVersion());
    }, []);

    return (
        <Alert color="light">Version: {version}</Alert>
    )
}

export default VersionInfo;
