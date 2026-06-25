import {type ChangeEvent, useEffect, useId, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectCustomerId, selectCustomerLookup} from "../ducks/mapping/mapping-selectors";
import {customerNo} from "../ducks/customers/customer-utils";
import type {SPSCustomerLookup} from "../appTypes";
import {fetchSearchCustomer} from "../api/mapping-api";
import classNames from "classnames";
import {setMappedCustomer} from "../ducks/mapping/mapping-actions";
import ExistingCustomerAlert from "../ducks/customers/ExistingCustomerAlert";
import {Col, Form, FormControl, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";

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
            return dispatch(setMappedCustomer({ARDivisionNo, CustomerNo, CustomerName: ''}));
        }
    }


    const buttonClassName = classNames('btn btn-sm', {
        'btn-warning': customerNo(customer) !== value,
        'btn-secondary': customerNo(customer) === value,
        'btn-disabled': !value,

    })
    return (
        <div>
            <Form.Group as={Row} width={9} label="Customer Number">
                <Form.Label column sm={3}>Customer Number</Form.Label>
                <Col>
                    <InputGroup size="sm">
                        <InputGroup.Text>
                            {customer?.CustomerName ?? <span className="bi-question-circle-fill"/>}
                        </InputGroup.Text>
                        <FormControl type="text" value={value} onChange={changeHandler} list={id} required
                                     size="sm"
                                     placeholder="##-XX####"/>
                        <button className={buttonClassName} disabled={!value} onClick={applyCustomerHandler}>Apply
                        </button>
                    </InputGroup>
                    <datalist id={id}>
                        {customers.map(c => (
                            <option key={customerNo(c) ?? ''} value={customerNo(c) ?? ''}>{c.CustomerName}</option>
                        ))}
                    </datalist>
                </Col>
            </Form.Group>
            {!!customer && !customerId && <ExistingCustomerAlert newCustomer={customer}/>}
        </div>
    );
}
export default CustomerLookup;
