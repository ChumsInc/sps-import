import React, {ChangeEvent, useEffect, useId, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectCustomerId, selectCustomerLookup} from "../ducks/mapping/mapping-selectors";
import {customerNo} from "../ducks/customers/customer-utils";
import {SPSCustomerLookup} from "../appTypes";
import {fetchSearchCustomer} from "../api/mapping-api";
import {FormColumn} from "chums-components";
import classNames from "classnames";
import {setMappedCustomer} from "../ducks/mapping/mapping-actions";
import ExistingCustomerAlert from "../ducks/customers/ExistingCustomerAlert";

const CustomerLookup = () => {
    const dispatch = useAppDispatch();
    const customer = useAppSelector(selectCustomerLookup);
    const customerId = useAppSelector(selectCustomerId);
    const [value, setValue] = useState(customerNo(customer) ?? '');
    const [customers, setCustomers] = useState<SPSCustomerLookup[]>([])
    const [loading, setLoading] = useState(false);
    const timer = useRef<number>(0);
    const abortController = useRef<AbortController>(new AbortController());
    const id = useId();

    useEffect(() => {
        window.clearTimeout(timer.current);
        if (!value) {
            setCustomers([]);
            return;
        }
        timer.current = window.setTimeout(async () => {
            if (loading && abortController.current.signal) {
                console.log('aborting because: ', {loading, value})
                abortController.current.abort('value changed')
            }
            setLoading(true);
            const customers = await fetchSearchCustomer(value, abortController.current.signal);
            setLoading(false);
            setCustomers(customers);
        }, 750);
        return () => {
            window.clearTimeout(timer.current);
        }
    }, [value]);

    useEffect(() => {
        if (loading && abortController.current) {
            console.log('aborting because: ', {loading, value, customer});
            abortController.current.abort();
            setLoading(false);
        }
        setValue(customerNo(customer) ?? '');
    }, [customer])

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => setValue(ev.target.value);

    const applyCustomerHandler = () => {
        const [_customer] = customers.filter(c => customerNo(c) === value);
        if (_customer) {
            return dispatch(setMappedCustomer(_customer));
        }

        if (/^(0[1-9])-(\S+)$/.test(value)) {
            const [ARDivisionNo, CustomerNo] = value.trim().split('-');
            return dispatch(setMappedCustomer({Company: 'chums', ARDivisionNo, CustomerNo, CustomerName: ''}));
        }
    }


    const buttonClassName = classNames('btn btn-sm', {
        'btn-warning': customerNo(customer) !== value,
        'btn-secondary': customerNo(customer) === value,
        'btn-disabled': !value,

    })
    return (
        <div>
            <FormColumn width={9} label="Customer Number">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">
                        {customer?.CustomerName ?? <span className="bi-question-circle-fill"/>}
                    </div>
                    <input type="text" value={value} onChange={changeHandler} list={id} required
                           className="form-control form-control-sm"
                           placeholder="##-XX####"/>
                    <button className={buttonClassName} disabled={!value} onClick={applyCustomerHandler}>Apply</button>
                </div>
                <datalist id={id}>
                    {customers.map(c => (
                        <option key={customerNo(c) ?? ''} value={customerNo(c) ?? ''}>{c.CustomerName}</option>
                    ))}
                </datalist>
            </FormColumn>
            {!!customer && !customerId && <ExistingCustomerAlert newCustomer={customer}/>}
        </div>
    );
}
export default CustomerLookup;
