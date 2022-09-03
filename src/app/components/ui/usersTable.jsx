import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './common/table/tableHeader';
import TableBody from './common/table/tableBody';
import BookMark from './common/bookmark';
import QualitiesList from './ui/qualities/qualitiesList';
import Table from './common/table/table';
import {Link} from 'react-router-dom';
const UsersTable = ({users, onSort, selectedSort, onToggleBookMark, onDelete, ...rest}) => {
    const columns = {
        name: {
            path: 'name',
            name: 'Имя',
            component: (user) => <Link to={`/users/${user._id}`}>{user.name}</Link>
        },
        qualities: {
            name: 'Качества',
            component: (user) => (
                <QualitiesList qualities={user.qualities}/>
            )
        },
        profession: {path: 'profession.name', name: 'Профессия'},
        completedMeetings: {path: 'completedMeetings', name: 'Встретился, раз'},
        rate: {path: 'rate', name: 'Оценка'},
        bookmark: {
            path: 'bookmark',
            name: 'Избранное',
            component: (user) => (
                <BookMark
                    status={user.bookmark}
                    onClick={() => onToggleBookMark(user._id)}
                />
            )
        },
        delete: {
            component: (user) => (
                <button
                    onClick={() => onDelete(user._id)}
                    className="btn btn-danger"
                >
                    delete
                </button>
            )
        }
    };
    return (
        <Table onSort={onSort} selectedSort={selectedSort} columns={columns} data={users}>
            <TableHeader {...{selectedSort, onSort, columns}}/>
            <TableBody {...{data: users, columns}} />
        </Table>
    );
};
UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    rest: PropTypes.object,
    onSort: PropTypes.func.isRequired,
    selectedSort: PropTypes.object.isRequired,
    onToggleBookMark: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};
export default UsersTable;
