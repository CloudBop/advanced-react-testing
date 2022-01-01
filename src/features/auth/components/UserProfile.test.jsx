// import { render, screen } from "@testing-library/react";
// overrules render method for configuring redux Provider
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

test("redirect is user === falsy", () => {
  const { history } = render(<UserProfile />);
  // expect(screen.queryByText(/hi/i)).not.toBeInTheDocument();
  // asserting on history object
  expect(history.location.pathname).toBe("/signin");
});
