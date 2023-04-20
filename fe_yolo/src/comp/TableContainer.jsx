import React, { useContext } from 'react';
import { YoloContext } from '../App';
import { RiAddCircleFill } from 'react-icons/ri';

const TableContainer = ({ children }) => {
  const { setModalIsOpen, activeTab, setUserModalIsOpen } = useContext(YoloContext);
  const onAddNew = () => {
    if (activeTab === 'Users') {
      setUserModalIsOpen(true);
      return;
    }
    setModalIsOpen(true);
  };
  return (
    <div className="flex flex-col gap-2   ">
      <button onClick={onAddNew} className=" self-end text-green-500 items-center flex gap-1">
        <RiAddCircleFill className="text-xl text-green-500" />
        Add New
      </button>
      {children}
    </div>
  );
};
export default TableContainer;
