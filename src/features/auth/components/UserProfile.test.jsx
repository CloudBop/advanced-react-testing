import { render, screen } from "@testing-library/react";

import { UserProfile } from "./UserProfile";

test("greets current user", () => {
  render(<UserProfile />);
  expect(screen.getByText(/hi/i)).toBeInTheDocument();
});
