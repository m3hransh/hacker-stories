import React from "react";
import axios from "axios";
import styles from "./App.module.css";
import List from "./List";
import SearchForm from "./SearchForm";
import LastSearches from "./LastSearches";
import { StoriesState, StoriesAction, Story } from "./types";

// Good practice for encapsulating complex states with different
// variables
const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page === 0 
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story: Story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};
// Defining custom Hook
// So it can be usable
const useSemiPerisitenctState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  // used to prevent the useEffect run
  // when the component is mounted
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    // At the first run isMounted become true
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      // conlose.log("A");
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};
// Used inside axios to get the story hits
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='


const extractSearchTerm = (url: string) => url.match(/(?<=query=).*?(?=$|&)/)[0];

const getLastSearched = (urls: Array<string>) =>
  urls.slice(-6, urls.length - 1).map(extractSearchTerm);

const getUrl = (searchTerm: string, page: number) => 
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

function App() {
  const [searchTerm, setSearchTerm] = useSemiPerisitenctState(
    "search",
    "React"
  );

  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

  /* dispatch function just get the action and
  dispatch that with the current state and invoke
  the reducer function defined in advance */
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
    page:0,
  });
  // useCallback prevent the redifination of function when rendering
  // happens as a result we can use its signiture as effect listener
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSearch(searchTerm, 0);
    // Prevent browser reload
    event.preventDefault();
  };

  const handleLastSearches = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);
    const newUrls = urls.filter((item) => item !== url);
    setUrls(newUrls.concat(url));
  };

  const lastSearches = getLastSearched(urls);

  const handleMore = () => {
    const lastUrl = urls[urls.length -1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        className={styles.searchForm}
      />
      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearches}
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      <List list={stories.data} onRemoveItem={handleRemoveStory} />
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
    <button
      type='button'
      onClick={handleMore}
      >
        More
      </button>
      )}
    </div>
  );
}
export default App;

export { storiesReducer };
