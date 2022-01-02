import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";

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

//
// asserts against showId query param
test("'purchase' button pushes the correct URL", async () => {
  const forceError = new Error("ERROR:FAKEFAIL TODO:REALFAIL");
  console.error(forceError);

  const { history } = render(<App />, {
    // has to be authenticated || redirects to signin
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
    routeHistory: ["/tickets/0"],
  });

  const purchaseBtn = await screen.findByRole("button", {
    name: /purcahse/i,
  });

  fireEvent.click(purchaseBtn);
});
