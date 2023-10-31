import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Header } from '../../../components/common/Header/Header.tsx';

const mockedLoggedInUser = {
    id: "user_id",
    email: "johndoe@me.com",
    email_verified: true,
    sub: "google-oauth2|12345678901234",
    nickname: "user_nick_name"
}

describe('Header Component', () => {
    test("renders the user's nickname below the user avatar properly", () => {
        render(<Header logout={jest.fn()} user={mockedLoggedInUser} />);

        const nickNameNode = screen.getByText(mockedLoggedInUser.nickname);
        expect(nickNameNode).toBeInTheDocument();
    });

    test("displays the 'Log Out' button when user is logged-in", async () => {
        render(<Header logout={jest.fn()} user={mockedLoggedInUser} />);
        await user.click(screen.getByTestId("dropdown-basic"));

        const logOutButton = screen.getByText("Log Out");

        expect(logOutButton).toBeInTheDocument();
    });
});
