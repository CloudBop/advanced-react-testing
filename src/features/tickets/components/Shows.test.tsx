import { getByRole, getByText, render, screen } from "../../../test-utils";
import { Shows } from "./Shows";

// name: "Avalanche of Cheese",
// description: "rollicking country with ambitious kazoo solos",

test("displays relevant show details for non-sold-out show", async () => {
  //
  render(<Shows />);
  const shows = await screen.findAllByRole("listitem");
  const nonSoldOutShow = shows[0];
  const ticketButton = getByRole(nonSoldOutShow, "button", {
    name: /tickets/i,
  });
  expect(ticketButton).toBeInTheDocument();
  //
  const bandName = getByRole(nonSoldOutShow, "heading", {
    name: "avalanche of cheese",
  });
  expect(bandName).toBeInTheDocument();
  //
  const bandDescription = getByText(
    nonSoldOutShow,
    "rollicking country with ambitious kazoo solos"
  );
  expect(bandDescription).toBeInTheDocument();
});
test("displays relevant show details for SOLD-OUT show", async () => {
  //
  render(<Shows />);
  const shows = await screen.findAllByRole("listitem");
  const soldOutShow = shows[0];
  //
  const soldOutMessage = getByRole(soldOutShow, "heading", {
    name: /sold out/i,
  });
  expect(soldOutMessage).toBeInTheDocument();
  //
  const bandName = getByRole(soldOutShow, "heading", {
    name: /the joyful nun riot/i,
  });
  expect(bandName).toBeInTheDocument();
  //
  const bandDescription = getByText(
    soldOutShow,
    /serious world music with an iconic musicial saw/i
  );
  expect(bandDescription).toBeInTheDocument();
});
