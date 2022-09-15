import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {validator} from '../../../utils/validator';

const FormComponent = ({children, validatorConfig, onSubmit, defaultData}) => {
    const [data, setData] = useState(defaultData || {});
    const [errors, setErrors] = useState({});

    const handelChange = useCallback((target) => {
        if (target) {
            setData(prevSate => ({...prevSate, [target.name]: target.value}));
        }
    }, [setData]);

    const isValid = Object.keys(errors).length === 0;

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return null;
        onSubmit(data);
        console.log(data);
    };
    useEffect(() => {
        if (Object.keys(data).length > 0) validate();
    }, [data]);

    const clonedElements = React.Children.map(children, (child) => {
        const childType = typeof child.type;
        let config;
        if (childType === 'object') {
            if (!child.props.name) {
                throw new Error('Name prop is required',
                    child);
            };
            config = {
                ...child.props,
                onChange: handelChange,
                value: data[child.props.name] || '',
                error: errors[child.props.name]
            };
        }
        if (childType === 'string') {
            if (child.type === 'button') {
                if (child.props.type === 'submit' || child.props.type === undefined) {
                    config = {...child.props, disabled: !isValid};
                }
            }
        }
        return React.cloneElement(child, config);
    });

    return (
        <form onSubmit={handleSubmit}>
            {clonedElements}
        </form>
    );
};
FormComponent.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    validatorConfig: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    defaultData: PropTypes.object
};
export default FormComponent;
