import { render, screen } from '@testing-library/react'
import { Header } from '../components/common/Header/Header.tsx';

test("renders the user's avatar", () => {
    render(<Header />);

    const usersAatar = screen.getByAltText("user-google-avatar");
    expect(usersAatar).toBeInTheDocument();
});

test("renders the user's nickname properly", () => {
    render(<Header />);

    const usersNickName = document.getElementById("dropdown-basic");
    expect(usersNickName).toBeInTheDocument();
});
