
import InputWithLabel from '../InputWithLabel';
import styles from '../App.module.css';
import { SearchFormProps } from './types';

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  className,
}: SearchFormProps) => (
  <form onSubmit={onSearchSubmit} className={className}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button
      type="submit"
      disabled={!searchTerm}
      className={`${styles.button} ${styles.buttonLarge}`}
    >
      Submit
    </button>
  </form>
);

export default SearchForm;