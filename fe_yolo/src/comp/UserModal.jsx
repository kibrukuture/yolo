import React, { useState, useContext, useEffect } from 'react';
import { YoloContext } from '../App';
const UserModal = ({ data }) => {
  // use context
  const { handler, setUserModalIsOpen, setAlert } = useContext(YoloContext);

  const [name, setName] = useState(data?.name || '');
  const [street, setStreet] = useState(data?.address?.street || '');
  const [city, setCity] = useState(data?.address?.city || '');
  const [email, setEmail] = useState(data?.email || '');
  const [country, setCountry] = useState(data?.address?.country || '');

  // check at least one field is different
  function isDifferent(prevData, currData) {
    return ['name', 'email', 'address'].some((prop) => {
      if (prop === 'address') {
        //check if any of  properties & values are different
        return Object.keys(prevData?.address).some((addressProp) => {
          return prevData?.address?.[addressProp] !== currData.address[addressProp];
        });
      }
      return prevData?.[prop] !== currData[prop];
    });
  }

  const onFormSubmit = (e) => {
    e.preventDefault();

    // return early if no changes
    if (data?.id && !isDifferent(data, { name, email, address: { street, city, country } })) {
      setUserModalIsOpen(false);
      return;
    }
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        address: {
          street,
          city,
          country,
        },
        id: data?.id || '',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // inform parent about db update
        handler.onChildUpdateUsers();
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        // todo: handle error
      });

    // submit form and close modal
    setUserModalIsOpen(false);

    if (!data?.id) {
      setAlert({ id: '', name, status: true, duration: 4000, type: 'add' });
    } else if (isDifferent(data, { name, email, address: { street, city, country } })) {
      setAlert({
        id: data?.id,
        name,
        status: true,
        duration: 4000,
        type: 'edit',
      });
    }

    setTimeout(() => {
      setAlert({ id: '', name: '', status: false, duration: 0, type: '' });
    }, 4000);

    // reset user id
    handler.onUserId('');

    // reset form
    setName('');
    setCity('');
    setStreet('');
    setCountry('');
    setEmail('');
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
              <label htmlFor="city" className="block font-medium text-gray-700">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="city"
                type="text"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="street" className="block font-medium text-gray-700">
                Street
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                id="street"
                type="text"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block font-medium text-gray-700">
                Country
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                id="country"
                type="text"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                className="border-2 flex-grow border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm"
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

export default UserModal;
