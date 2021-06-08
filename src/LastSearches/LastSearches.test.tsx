import { render, screen, fireEvent } from "@testing-library/react"
import { last } from "lodash";
import LastSearches from './index'


const lastSearches:Array<string> = [
   'react', 
   'ml', 
   'JavaScript', 
   'a', 
   'redux'];

describe("LastSearches", () => {
  test("renders last five searches", () => {
    render(<LastSearches 
    lastSearches={lastSearches} 
    onLastSearch={jest.fn()}
    />);

    expect(screen.getAllByRole('button').length).toBe(5);
  })
})