import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

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
