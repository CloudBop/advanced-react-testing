// import { render, screen } from "@testing-library/react";
// overrules render method for configuring redux Provider
import { App } from "../../../App";
import { render, screen } from "../../../test-utils";
import { UserProfile } from "./UserProfile";

const testUser = {
  email: "booking@avalancheofcheese.com",
};

test("greets current user", () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: testUser } },
  });
  expect(
    screen.getByText(/hi, booking@avalancheofcheese.com/i)
  ).toBeInTheDocument();
});
// Implementation Testing
test("redirect is user === falsy", () => {
  const { history } = render(<UserProfile />);
  // expect(screen.queryByText(/hi/i)).not.toBeInTheDocument();
  // asserting on history object
  expect(history.location.pathname).toBe("/signin");
});

// Behavioural Testing - UI
test("view sign-in page when loading profile while not logged in", () => {
  render(<App />, { routeHistory: ["/profile"] });
  const heading = screen.getByRole("heading", {
    name: /Sign in to your account/i,
  });
  expect(heading).toBeInTheDocument();
});
