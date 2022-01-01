import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

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
