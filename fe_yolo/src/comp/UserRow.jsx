import React, { useContext } from 'react';
import { YoloContext } from '../App';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

const UserRow = ({ user }) => {
  const { name, email, address, id } = user;

  const location = address.street + ', ' + address.city;

  const { handler, setUserModalIsOpen, setAlert } = useContext(YoloContext);

  // delete user data
  const onDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      const success = await response.json();

      // delete complete , fetch a new data
      handler.onChildUpdateUsers();

      //set alert
      setAlert({ id, name, status: success, duration: 4000, type: 'delete' });

      //remove alert
      setTimeout(() => {
        setAlert({
          id: '',
          name: '',
          status: '',
          duration: 0,
          type: '',
        });
      }, 4000);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <tr className="text-gray-700">
      <td className="px-4 py-3 border">
        <p className="flex items-center text-sm">
          <span className="font-semibold text-black">{name}</span>
          {/* <p className='text-xs text-gray-600'>Developer</p> */}
        </p>
      </td>
      <td className="px-4 py-3 text-ms font-semibold border">{location}</td>
      <td className="px-4 py-3 text-ms font-semibold border">{address.country}</td>
      <td className="px-4 py-3 text-xs border">
        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> {email} </span>
      </td>
      <td className="px-4 py-3 text-sm border">
        <p className="flex justify-between items-center">
          <button aria-label="Edit user data">
            <AiFillEdit
              onClick={() => {
                setUserModalIsOpen(true);
                handler.onUserId(id);
              }}
              className="text-xl text-green-300 hover:text-green-500"
            />
          </button>
          <button onClick={() => onDelete(id)} aria-label="Delete user data">
            <AiFillDelete className="text-xl text-red-300 hover:text-red-500" />
          </button>
        </p>
      </td>
    </tr>
  );
};

export default UserRow;
