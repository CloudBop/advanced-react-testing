import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

test("clicking sign-in button pushes '/sign-in' to history ", () => {
  const { history } = render(<NavBar />);
  const signInButton = screen.getByRole("button", { name: /sign in/i });
  fireEvent.click(signInButton);
  expect(history.location.pathname).toBe("/signin");
});
