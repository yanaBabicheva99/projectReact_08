import React, {useState, useEffect} from 'react';
import Pagination from './pagination';
import {paginate} from '../utils/paginate';
import PropTypes from 'prop-types';
import GroupList from './groupList';
import api from '../api/index';
import SearchStatus from './searchStatus';
import UsersTable from './usersTable';
import _ from 'lodash';
const Users = ({users, ...rest}) => {
    const pageSize = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const [professions, setProfessions] = useState();
    const [selectedProf, setSelectedProf] = useState();
    const [selectedSort, setSelectedSort] = useState({path: 'name', order: 'asc'});

    useEffect(() => {
        api.professions.fetchAll().then((data) => setProfessions(data));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProf]);

    const handleProfessionSelect = (item) => {
        setSelectedProf(item);
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const clearFilter = () => {
        setSelectedProf();
    };

    const handleSort = (item) => {
        setSelectedSort(item);
    };

    const filteredUsers = selectedProf
        ? users.filter(user => JSON.stringify(user.profession) === JSON.stringify(selectedProf))
        : users;

    const count = filteredUsers.length;
    const sortedUsers = _.orderBy(filteredUsers, [selectedSort.path], [selectedSort.order]);
    const userCrop = paginate(sortedUsers, currentPage, pageSize);

    return (
        <div style={{display: 'flex'}}>
            {professions && (
                <div style={{margin: '10px'}}>
                    <GroupList
                        items={professions}
                        onItemSelect={handleProfessionSelect}
                        valueProperty='_id'
                        contentProperty='name'
                        selectedItem={selectedProf}
                    />
                    <button className='btn btn-primary btn-sm m-2' onClick={clearFilter}>Очистить</button>
                </div>
            ) }
            <div style={{margin: '10px'}}>
                <SearchStatus length={count} />
                {count > 0 && (
                    <UsersTable
                        users={userCrop}
                        {...rest}
                        onSort={handleSort}
                        selectedSort={selectedSort}
                    />
                )}
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Pagination
                        itemsCount={count}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
};

Users.propTypes = {
    users: PropTypes.array.isRequired
};

export default Users;
