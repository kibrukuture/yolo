import React, { useState, createContext } from 'react';
import Filter from './comp/Filter';
import logo from './assets/yolo.png';
import GameTable from './comp/GameTable';
import UserTable from './comp/UserTable';
import Popup from './comp/Popup';
import { useEffect } from 'react';
import TableContainer from './comp/TableContainer';
import UserModal from './comp/UserModal';
import Alert from './comp/Alert';
import Pagination from './comp/Pagination';

// context
export const YoloContext = createContext();

function App() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('Users');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [userModalIsOpen, setUserModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  //alert
  const [alert, setAlert] = useState({
    id: '',
    name: '',
    status: false,
    duration: 0,
    type: '',
  });

  // fetch users
  const onFetchUsers = () => {
    fetch('http://localhost:5000/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        alert('Failed to fetch users. Please try again later.');
      });
  };
  useEffect(() => {
    onFetchUsers();
  }, []);

  const onFetchGames = () => {
    fetch('http://localhost:5000/api/games')
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
      })
      .catch((err) => {
        alert('Failed to fetch games. Please try again later.');
      });
  };

  // fetch games
  useEffect(() => {
    onFetchGames();
  }, []);
  const onChildUpdateGames = () => {
    onFetchGames();
  };
  const onChildUpdateUsers = () => {
    onFetchUsers();
  };

  const tabClasses = 'block px-4 py-2 rounded-lg text-gray-800 font-medium';
  const activeTabClasses = `${tabClasses} bg-[#faf9f3f7] text-green-500`;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSubmit = (e, value) => {
    e.preventDefault();
  };
  const onClose = (value) => {
    setModalIsOpen(value);
    setUserModalIsOpen(value); // close user modal
  };
  const onUserId = (id) => {
    setUserId(id);
  };

  const sharedDataAndFns = {
    activeTab,
    setActiveTab,
    modalIsOpen,
    setModalIsOpen,
    games,
    setGames,
    users,
    setUsers,
    userModalIsOpen,
    setAlert,
    setUserModalIsOpen,
    currentPage,
    setCurrentPage,
    handler: {
      onSubmit,
      onClose,
      onUserId,
      onChildUpdateGames,
      onChildUpdateUsers,
    },
  };

  const popUpData = getData(userId, games); // get the data of the user to be edited
  const userPopUpData = getData(userId, users); // get the data of the user to be edited

  const deleteAlert = alert.duration > 0 && alert.status && alert.type === 'delete' && (
    <Alert alert={alert} setAlert={setAlert} />
  );
  const editAlert = alert.duration > 0 && alert.status && alert.type === 'edit' && (
    <Alert alert={alert} setAlert={setAlert} />
  );
  const addAlert = alert.duration > 0 && alert.status && alert.type === 'add' && (
    <Alert alert={alert} setAlert={setAlert} />
  );

  return (
    <>
      <YoloContext.Provider value={sharedDataAndFns}>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex md:gap-20 h-16 justify-between md:justify-start  ">
              <div className="flex items-center">
                <img className="h-20  w-auto mr-2" src={logo} alt="Logo" />
              </div>
              <div className="flex">
                <button
                  className={activeTab === 'Users' ? activeTabClasses : tabClasses}
                  onClick={() => setActiveTab('Users')}
                >
                  Users
                </button>
                <button
                  className={activeTab === 'Games' ? activeTabClasses : tabClasses}
                  onClick={() => setActiveTab('Games')}
                >
                  Games
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="w-11/12 md:w-9/12   mx-auto">
          <Filter />
          <TableContainer>{activeTab === 'Users' ? <UserTable /> : <GameTable />}</TableContainer>
        </div>
        {modalIsOpen && <Popup data={popUpData} />}
        {userModalIsOpen && <UserModal data={userPopUpData} />}

        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={activeTab === 'Users' ? getTotalPages(users) : getTotalPages(games)}
        />
      </YoloContext.Provider>

      {/* alerts */}
      {deleteAlert}
      {editAlert}
      {addAlert}
    </>
  );
}

export default App;

function getData(id, data) {
  return data.find((item) => item.id === id);
}
function getTotalPages(data) {
  return Math.ceil(data.length / 10);
}
