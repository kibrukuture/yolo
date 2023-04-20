import React, { useState, useContext, useEffect } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { YoloContext } from '../App';
import { useRef } from 'react';

// options
const options = {
  user: ['Name', 'Location', 'Country', 'Email'],
  game: ['Name', 'Category', 'Publisher', 'Release Date'],
};

function Filter() {
  const { activeTab, setGames, setUsers, setCurrentPage, handler } = useContext(YoloContext);

  // state
  const [filterTerm, setFilterTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [optionLabel, setOptionLabel] = useState(activeTab === 'Users' ? options.user[0] : options.game[0]);

  //
  const formRef = useRef(null);

  const onReset = (e) => {
    e.preventDefault();
    formRef.current.reset();
    setFilterTerm('');

    // fetch from db
    activeTab === 'Users' ? handler.onChildUpdateUsers() : handler.onChildUpdateGames();
  };
  const onFilter = (e) => {
    e.preventDefault();

    const route = activeTab === 'Users' ? 'users' : 'games';
    const date = activeTab === 'Users' ? '' : `&sdt=${startDate}&edt=${endDate}`;
    // fetch users
    fetch(`http://localhost:5000/api/filter?term=${filterTerm}${date}&option=${optionLabel}&route=${route}`)
      .then((res) => res.json())
      .then((data) => {
        activeTab === 'Users' ? setUsers(data) : setGames(data);
      });

    // reset paginatioon to 1
    setCurrentPage(1);
  };

  const getOptionLabel = (option) => {
    setOptionLabel(option);
  };

  return (
    <div className="my-5 ">
      <form ref={formRef} onSubmit={onFilter}>
        <div className="flex items-center gap-2 ">
          <Select
            activeTab={activeTab}
            label="Filter by"
            getOptionLabel={getOptionLabel}
            options={activeTab == 'Users' ? options.user : options.game}
          />
          <input
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            type="text"
            className="border-2 rounded flex-grow   border-gray-300 bg-white h-10 px-5 pr-16  text-sm  "
            placeholder={`Search by ${optionLabel}`}
          />
        </div>
        <div className="mt-5 flex flex-col md:flex-row sm:gap-4 md:justify-between top-5">
          {activeTab === 'Games' && (
            <div className="flex items-center gap-5">
              <input
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
                className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p>to</p>
              <input
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="flex mt-5 md:mt-0 gap-4 items-center self-end">
            <button onClick={(e) => onReset(e)}>Reset</button>
            <button
              type="submit"
              className="bg-green-100 hover:bg-green-200 focus:bg-green-200 active:bg-green-300 text-gray-800 font-semibold py-1 px-4 border border-green-300 rounded shadow-sm"
            >
              Filter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Filter;

function Select({ label, options, getOptionLabel, activeTab }) {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [showOptions, setShowOptions] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedOption(options[0]);
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    getOptionLabel(option);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setFocusedOptionIndex((prevIndex) =>
          prevIndex === null ? options.length - 1 : (prevIndex - 1 + options.length) % options.length
        );
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedOptionIndex((prevIndex) => (prevIndex === null ? 0 : (prevIndex + 1) % options.length));
        break;
      case 'Enter':
        if (focusedOptionIndex !== null) {
          handleOptionClick(options[focusedOptionIndex]);
        }
        break;
      case 'Escape':
        setShowOptions(false);
        break;
      default:
        break;
    }
  };

  const handleOptionFocus = (index) => {
    setFocusedOptionIndex(index);
  };

  return (
    <div className="relative w-64" ref={selectRef}>
      <label htmlFor="select" className="sr-only">
        {label}
      </label>

      <div
        role="listbox"
        aria-label={label}
        className={`relative border border-gray-300 rounded-md px-4 py-2 cursor-pointer flex items-center justify-between ${
          showOptions ? 'bg-green-100' : ''
        }`}
        onClick={() => setShowOptions(!showOptions)}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        <span className="text-gray-800">{selectedOption}</span>
        <BsChevronDown className="h-5 w-5 text-gray-700" />
      </div>
      {showOptions && (
        <div className="absolute w-full mt-2   bg-white shadow-lg z-10">
          {options.map((option, index) => (
            <div
              key={option}
              role="option"
              aria-selected={option === selectedOption}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 focus:bg-green-100 ${
                option === selectedOption ? 'bg-green-100' : ''
              }`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => handleOptionFocus(index)}
              onFocus={() => handleOptionFocus(index)}
              onBlur={() => setFocusedOptionIndex(null)}
              tabIndex="0"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
