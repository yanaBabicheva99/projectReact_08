import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import api from '../../../api';
import {useHistory} from 'react-router-dom';
import FormComponent, {TextField, SelectField} from '../../common/form/index';
const UserEdit = ({id}) => {
    useEffect(() => {
        api.users.getById(id).then(data => {
            setData({
                name: data.name,
                email: data.email,
                profession: data.profession._id
            });
        });
    }, []);

    const history = useHistory();
    const [professions, setProfessions] = useState({});
    const [data, setData] = useState();

    useEffect(() => {
        api.professions.fetchAll().then((data) => {
            const professionsList = Object.keys(data).map((professionName) => ({
                label: data[professionName].name,
                value: data[professionName]._id
            }));
            setProfessions(professionsList);
        });
    }, []);

    const validatorConfig = {
        email: {
            isRequired: {
                message: 'Электронная почта обязательна для заполнения'
            },
            isEmail: {
                message: 'Email введен не корректно'
            }
        },
        name: {
            isRequired: {
                message: 'Имя обязательно для заполнения'
            }
        }
    };
    const getProfessionById = (id) => {
        for (const prof of professions) {
            if (prof.value === id) {
                return {_id: prof.value, name: prof.label};
            }
        }
    };

    const handelSubmit = (data) => {
        console.log(data);
        const {profession} = data;
        const updatedUser = {
            ...data,
            profession: getProfessionById(profession)
        };
        api.users.update(id, updatedUser).then(user => console.log(user));
        history.push(`/users/${id}`);
    };
    return (
        <div className='container mt-5'>
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {
                        (Object.keys(professions).length !== 0
                            ? (
                                <FormComponent
                                    onSubmit={handelSubmit}
                                    validatorConfig={validatorConfig}
                                    defaultData={data}
                                >
                                    <TextField
                                        name='name'
                                        label='Имя'
                                    />
                                    <TextField
                                        name='email'
                                        label='Электронная почта'
                                    />
                                    <SelectField
                                        name='profession'
                                        options={professions}
                                        defaultOption='Choose...'
                                        label='Выберите вашу профессию'
                                    />
                                    <button className='btn btn-primary w-100 mx-auto mt-4'>Обновить</button>
                                </FormComponent>
                            )
                            : <h2>Loading...</h2>)
                    }
                </div>
            </div>
        </div>
    );
};

UserEdit.propTypes = {
    id: PropTypes.string.isRequired
};
export default UserEdit;
