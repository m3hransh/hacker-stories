import { render, screen, fireEvent, act } from "@testing-library/react";
import { Story, Stories } from '../types'
import List, {Item} from './index';

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

describe("Item", () => {
  test("renders all properties", () => {
    render(<Item item={storyOne} onRemoveItem={jest.fn()} />);

    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      'href',
      'https://reactjs.org/'
    );
  });

  test("renders a clickable dismiss button", () => {
    render(<Item item={storyOne} onRemoveItem={jest.fn()} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test("clicking the dismiss button calls the callback handler", () => {
    const handleRemoveItem = jest.fn();

    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("List", () => {
  test("renders all Items of List", () => {
    render(<List list={stories} onRemoveItem={jest.fn()} />);

    expect(screen.getAllByRole('button').length).toBe(2);
  });
});