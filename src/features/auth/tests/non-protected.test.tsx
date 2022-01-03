import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

test.each([
  { routeName: "Home", routePath: "/", headingMatch: /welcome/i },
  // { routeName: "Band 1", routePath: "/bands/1", headingMatch: /joyous/i },
])(
  // future jest release will allow $routeName
  `homepage does not redirect to login screen`,
  ({ routePath, headingMatch }) => {
    render(<App />, { routeHistory: [routePath] }); // dont need to specify route
    const homeHeading = screen.getByRole("heading", { name: headingMatch });
    expect(homeHeading).toBeInTheDocument();
  }
);

test.each([
  { routeName: "Home", routePath: "/", headingMatch: /welcome/i },
  { routeName: "Band 1", routePath: "/bands/1", headingMatch: /joyous/i },
  { routeName: "Shows", routePath: "/shows", headingMatch: /upcoming shows /i },
])(
  // future jest release will allow $routeName
  `homepage does not redirect to login screen`,
  async ({ routePath, headingMatch }) => {
    render(<App />, { routeHistory: [routePath] }); // dont need to specify route
    const heading = await screen.findByRole("heading", { name: headingMatch });
    expect(heading).toBeInTheDocument();
  }
);
