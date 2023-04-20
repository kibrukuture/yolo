import React, { useContext } from 'react';
import { YoloContext } from '../App';
import UserRow from './UserRow';
import InfoAlert from './InfoAlert';

const UserTable = () => {
  const { users } = useContext(YoloContext);
  const { currentPage, itemsPerPage = 10 } = useContext(YoloContext);

  // pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  if (users.length === 0) {
    return <InfoAlert />;
  }
  return (
    <section className="    font-mono w-full">
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayedUsers.map((user) => {
                return <UserRow key={user.id} user={user} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
export default UserTable;
