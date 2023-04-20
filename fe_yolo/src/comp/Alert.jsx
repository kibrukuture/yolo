import React from 'react';

const Alert = ({ alert, setAlert }) => {
  const alertEnd = getAlert(alert);
  const alertMsg = `${alert.name} ${alert.id && '/ Id: ' + alert.id + ' / '}`;
  const txtColor = alert.status ? 'text-green-500' : 'text-red-500';
  const bgColor = alert.status
    ? 'bg-green-100 border border-green-400 text-green-700'
    : 'bg-red-100 border border-red-400 text-red-700';

  return (
    <div className={`fixed bottom-2 left-2 right-2 ${bgColor} px-4 py-3 rounded`} role="alert">
      <strong className="font-bold">{alert.status ? 'Succes: ' : 'Failed :'}</strong>
      <span className="block sm:inline">{alertMsg + (alert.status ? ' ' + alertEnd : `could not be ${alertEnd}`)}</span>
      <button
        onClick={() => setAlert({ id: '', name: '', status: false, duration: 0 })}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
      >
        <svg
          className={`fill-current h-6 w-6 ${txtColor}`}
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </button>
    </div>
  );
};

function getAlert(alert) {
  const alertTypes = {
    add: 'added',
    delete: 'deleted',
    edit: 'edited',
  };

  return alertTypes[alert.type] || '';
}

export default Alert;
