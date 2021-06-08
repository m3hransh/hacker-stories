
export interface Story {
  objectID: number;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
}

export type Stories = Array<Story>;

export interface StoriesState {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
  page: number;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
}

interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: {
    list: Stories;
    page: number;
  } 
};

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction{
  type: 'REMOVE_STORY';
  payload: Story;
}

export type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;