import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {loadVersion, selectVersion} from "./index";
import {Alert} from "react-bootstrap";

const VersionInfo = () => {
    const dispatch = useAppDispatch();
    const version = useAppSelector(selectVersion);

    useEffect(() => {
        dispatch(loadVersion());
    }, []);

    return (
        <Alert variant="secondary">Version: {version}</Alert>
    )
}

export default VersionInfo;
