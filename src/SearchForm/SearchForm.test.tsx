import { render, screen, fireEvent, act } from "@testing-library/react";
import {SearchFormProps} from './types';
import SearchForm from './index';

describe("SearchForm", () => {
  const searchFormProps: SearchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
    className: "Search",
  };

  test("renders the input field with its value", () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  test("renders the correct label", () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test("calls onSearchInput on input field change", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test("calls onSearchSubmit on button submit click", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.submit(screen.getByRole('button'));

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });

  test('renders snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});