import {LastSearchesProps} from './types'

const LastSearches = ({ lastSearches, onLastSearch }: LastSearchesProps) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <button
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </button>
    ))}
  </>
);

export default LastSearches;