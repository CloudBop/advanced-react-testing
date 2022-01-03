import { App } from "../../../App";
import { render } from "../../../test-utils";

test("redirect to /tickets:showId if seatCount is missing from params", () => {
  const { history } = render(<App />, {
    //
    routeHistory: ["/confirm/0?holdId=12345"],
    // has to be authenticated, redirects to sign in
    preloadedState: {
      user: { userDetails: { email: "test@test.com" } },
    },
  });
  expect(history.location.pathname).toBe("/tickets/0");
});
