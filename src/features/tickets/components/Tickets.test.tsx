import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

test("tickets page displays correct data for showId", async () => {
  render(<App />, {
    // has to be authenticated || redirects to signin
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
    routeHistory: ["/tickets/0"],
  });

  //
  const heading = await screen.findByRole("heading", {
    name: /avalanche of cheese/i,
  });
  expect(heading).toBeInTheDocument();
});
