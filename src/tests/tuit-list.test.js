import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";
import mockedTuits from "../components/tuits/tuits-data.json";

jest.mock('axios');

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];
const MOCKED_TUITS = [
    "alice's tuit", "bob's tuit", "charlie's tuit"
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={mockedTuits}/>
      </HashRouter>
  );
  const linkElement = screen.getByText(/Dragon spacecraft/i);
  expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>
    );
    const linkElement = screen.getByText(/Dragon spacecraft/i);
    expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
    axios.get.mockImplementation(() =>
        Promise.resolve({ data: {tuits: mockedTuits}}));
    const response = await findAllTuits();
    const tuits = response.tuits;

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);

    const tuit = screen.getByText(/Dragon spacecraft/i);
    expect(tuit).toBeInTheDocument();
});
