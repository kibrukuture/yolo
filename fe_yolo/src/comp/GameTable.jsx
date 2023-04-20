import React, { useContext } from 'react';
import { YoloContext } from '../App';
import GameRow from './GameRow';
import InfoAlert from './InfoAlert';

const GameTable = () => {
  const { games } = useContext(YoloContext);
  const { currentPage, itemsPerPage = 10 } = useContext(YoloContext);
  // pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedGames = games.slice(startIndex, endIndex);

  if (games.length === 0) {
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
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Publisher</th>
                <th className="px-4 py-3 whitespace-nowrap">Release Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayedGames.map((game) => {
                return <GameRow key={game.id} game={game} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
export default GameTable;
