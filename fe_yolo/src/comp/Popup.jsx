import React, { useState, useContext } from 'react';
import { YoloContext } from '../App';
const Popup = ({ data }) => {
  // use context
  const { handler, setModalIsOpen, setAlert } = useContext(YoloContext);
  const [name, setName] = useState(data?.name || '');
  const [category, setCategory] = useState(data?.cat || '');
  const [publisher, setPublisher] = useState(data?.pub || '');
  const [date, setDate] = useState(data?.at || '');

  // check if at least one field is different
  function isDifferent(prevData, currData) {
    return ['name', 'cat', 'pub', 'at'].some((prop) => prevData?.[prop] !== currData[prop]);
  }

  const onFormSubmit = (e) => {
    e.preventDefault();

    // return early if no changes
    if (data?.id && !isDifferent(data, { name, cat: category, pub: publisher, at: date })) {
      setModalIsOpen(false);
      return;
    }

    fetch('http://localhost:5000/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        id: data?.id || '',
        cat: category,
        pub: publisher,
        at: date,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // inform parent about db update
        handler.onChildUpdateGames();
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        // todo: handle error
      });

    // submit form and close modal
    setModalIsOpen(false);

    function setAlertAndReset({ name = '', status = false, duration = 0, type = '' }) {
      const id = data?.id || '';
      setAlert({ id, name, status, duration, type });
      setTimeout(() => {
        setAlert({ id: '', name: '', status: false, duration: 0, type: '' });
      }, duration);
    }

    setAlertAndReset({
      id: data?.id || '',
      name,
      status: true,
      duration: 4000,
      type: data?.id ? (isDifferent(data, { name, cat: category, pub: publisher, at: date }) ? 'edit' : '') : 'add',
    });

    // reset user id
    handler.onUserId('');

    // reset form
    setName('');
    setCategory('');
    setPublisher('');
    setDate('');
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-md shadow-lg p-6   md:w-45% sm:w-80%">
          {/* Form */}
          <form onSubmit={(e) => onFormSubmit(e)} className="space-y-4 ">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                type="text"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block font-medium text-gray-700">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="category"
                type="text"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block font-medium text-gray-700">
                Publisher
              </label>
              <input
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                id="category"
                type="text"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block font-medium text-gray-700">
                Date
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                id="date"
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                required
              />
            </div>
            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  handler.onClose(false);
                  handler.onUserId('');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;
