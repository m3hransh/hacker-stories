import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import axios from "axios";
import { StoriesAction, StoriesState, Stories, Story } from "./types";
import App, {
  storiesReducer,
} from "./App";

jest.mock("axios");
// test suite

const storyOne: Story = {
  title: "React",
  url: "https://reactjs.org/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo: Story = {
  title: "Redux",
  url: "https://redux.js.org",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories: Stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
  test("removes a story from all stories", () => {
    const action: StoriesAction = { type: "REMOVE_STORY", payload: storyOne };
    const state: StoriesState = { data: stories, isLoading:false, isError: false };

    const newState: StoriesState = storiesReducer(state, action);

    const expectedState: StoriesState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    }

    expect(newState).toStrictEqual(expectedState);
  });
});


describe("App", () => {
  test("succeeds fetching data", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(() => Promise.resolve());
    
    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByText('check.svg').length).toBe(2);
  });
  test('fails fetching data', async () =>{
    const promise = Promise.reject();

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    try {
      await act(() => promise);
    } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  test('removes a story', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementationOnce(() => promise);

    render(<App />);

    await act(() => Promise.resolve());

    expect(screen.getAllByText('check.svg').length).toBe(2);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(screen.getAllByText('check.svg').length).toBe(1);
    expect(screen.queryByText('Jordan Walke')).toBeNull(); 
  });

  test('search for specific stories', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory:Story = {
      title: 'JavaScript',
      url: 'https://en.wikipedia.org/wiki/JavaScript',
      author: 'Brendan Eich',
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation(url => {
      if (url.includes('React')) {
        return reactPromise;
      }
      if (url.includes('JavaScript')) {
        return javascriptPromise;
      }
      throw Error();
    });

    // Initial Render
    const {container} = render(<App />);

    //First Data Fetching

    await act(() => Promise.resolve());

    expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
    expect(
      screen.queryByText('Dan Abramov, Andrew Clark')
    ).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    // User Interaction -> Search
    fireEvent.change(screen.queryByDisplayValue('React'), {
      target: {
        value: 'JavaScript',
      },
    });
    expect(screen.queryByDisplayValue('React')).toBeNull();
    expect(
      screen.queryByDisplayValue('JavaScript')
    ).toBeInTheDocument();
    
    fireEvent.submit(screen.queryByText('Submit'));
    // Second Data Fetching

    await act(() => Promise.resolve() 
       );
    expect(
      screen.queryByDisplayValue('JavaScript')
    ).toBeInTheDocument();
    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(
      screen.queryByText('Dan Abramov, Andrew Clark')
    ).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();

  })
});
