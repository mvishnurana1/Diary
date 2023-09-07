import { act, render, screen } from '@testing-library/react'
import { Header } from '../../components/common/Header/Header.tsx';

describe('Header Component', () => {
    test("renders the user's avatar", () => {
        act(() => render(<Header />));
    
        const usersAatar = screen.getByAltText("user-google-avatar");
        expect(usersAatar).toBeInTheDocument();
    });
    
    test("renders the user's nickname properly", () => {
        act(() => render(<Header />));
    
        const usersNickName = document.getElementById("dropdown-basic");
        expect(usersNickName).toBeInTheDocument();
    });
});
