import { App } from "../../../App";
import { resetTransaction } from "../../../features/tickets/redux/ticketSlice";
import { fireEvent, render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

describe("sign-in button navigation", () => {
  // implmentation test
  test("clicking sign-in button pushes '/sign-in' to history ", () => {
    const { history } = render(<NavBar />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);
    // assert the history is updated
    expect(history.location.pathname).toBe("/signin");
  });

  // behavioural test
  test("Clicking sign-in button shows sign-in page", () => {
    render(<App />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);
    //
    expect(
      screen.getByRole("heading", { name: /Sign in to your account/i })
    ).toBeInTheDocument();
  });
});

describe("display when signin/ not signed in", () => {
  const userDetails = {
    email: "test@test.com",
  };
  //
  test("display Sign in Button when user is null", () => {
    render(<NavBar />, { preloadedState: { user: null } });
    // render(<NavBar />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
  //
  test("display Sign Out Button + user email when user is truthy", () => {
    render(<NavBar />, { preloadedState: { user: { userDetails } } });
    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/test@test.com/)).toBeInTheDocument();
  });
});
