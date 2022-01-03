import userEvent from "@testing-library/user-event";

import { App } from "../../../App";
import {
  getByRole, // assert from within tree
  render,
  screen,
  waitFor,
} from "../../../test-utils";

// test("redirects to signin from /profile when not authenticated", () => {
//   render(<App />, { routeHistory: ["/profile"] });
//   const signInHeader = screen.getByRole("heading", { name: /sign/i });
//   expect(signInHeader).toBeInTheDocument();
// });
test.each([
  { route: "/profile" },
  // /id
  { route: "/tickets/0" },
  { route: "/confirm/0?holdId=123&seatCount=2" },
])("redirects to signin from /profile when not authenticated", ({ route }) => {
  render(<App />, { routeHistory: [route] });
  const signInHeader = screen.getByRole("heading", { name: /sign/i });
  expect(signInHeader).toBeInTheDocument();
});

test("successful sign-in happyflowpath", async () => {
  // goto protected page
  const { history } = render(<App />, { routeHistory: ["/tickets/1"] });

  // sign in (after redirect)
  const emailField = screen.getByLabelText(/email/i);
  // userEvent.type(emailField, "test@test.com");
  userEvent.type(emailField, "booking@avalancheofcheese.com");
  //
  const passwordField = screen.getByLabelText(/password/i);
  // userEvent.type(passwordField, "test"); //  not testing server!
  userEvent.type(passwordField, "iheartcheese"); //  not testing server!

  // <Form data-testid={"sign-in-form"} />
  const signInForm = screen.getByTestId("sign-in-form");
  // ...in above component
  const signInButton = getByRole(signInForm, "button", {
    name: /sign in/i,
  });
  userEvent.click(signInButton);

  // async test assertions, we need to wait for response
  await waitFor(() => {
    expect(history.location.pathname).toBe("/tickets/1");
    // remove sign in from history
    // console.log(history);
    expect(history.entries).toHaveLength(1);
  });
  //
});
