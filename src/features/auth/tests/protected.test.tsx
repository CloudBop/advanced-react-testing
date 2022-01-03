import userEvent from "@testing-library/user-event";
import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from "msw";

import { App } from "../../../App";
import { baseUrl, endpoints } from "../../../app/axios/constants";
import { handlers } from "../../../mocks/handlers";
import { server } from "../../../mocks/server";
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
/** 1 */
test.each([
  { testName: "sign in", buttonName: /sign in/i },
  { testName: "sign up", buttonName: /sign up/i },
])("successful $testName happyflowpath", async ({ buttonName }) => {
  // goto protected page
  const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
  // sign in (after redirect)
  const emailField = screen.getByLabelText(/email/i);
  // userEvent.type(emailField, "test@test.com");
  userEvent.type(emailField, "booking@avalancheofcheese.com");
  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, "iheartcheese"); //  not testing server! see msw

  // <Form data-testid={"sign-in-form"} />
  const signInForm = screen.getByTestId("sign-in-form");
  // ...look in above component tree
  const signInButton = getByRole(signInForm, "button", {
    name: buttonName,
  });
  userEvent.click(signInButton);

  // async test assertions, we need to wait for response
  await waitFor(() => {
    expect(history.location.pathname).toBe("/tickets/1");
    // remove sign in from history
    // console.log(history);
    expect(history.entries).toHaveLength(1);
  });
});

// const signInError = (
//   req: RestRequest<DefaultRequestBody, RequestParams>,
//   res: ResponseComposition, // <any>, - linter doesn't allow any
//   ctx: RestContext
// ) => res(ctx.status(500)); // server error

// sign in & signup errors aka server error
const serverError = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition, // <any>, - linter doesn't allow any
  ctx: RestContext
) => res(ctx.status(500)); // server error

const signInFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition, // <any>, - linter doesn't allow any
  ctx: RestContext
) =>
  res(
    ctx.status(401),
    ctx.json({ message: "Unauthorized Error is an HTTP status" })
  );

const signUpFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition, // <any>, - linter doesn't allow any
  ctx: RestContext
) => res(ctx.status(400), ctx.json({ message: "Email is already in use" }));
/** 2 */
test.each([
  {
    endpoint: endpoints.signIn,
    outcome: "failure",
    responseResolver: signInFailure,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signIn,
    outcome: "serverError",
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "failure",
    responseResolver: signUpFailure,
    buttonNameRegex: /sign up/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "failure",
    responseResolver: serverError,
    buttonNameRegex: /sign up/i,
  },
])(
  "$endpoint $outcome and then followed by successs ",
  async ({ endpoint, responseResolver, buttonNameRegex }) => {
    // reset the msw handler to respond unsuccessfully
    const errorHandler = rest.post(`${baseUrl}/${endpoint}`, responseResolver);
    // overrule default server.handler
    server.resetHandlers(...handlers, errorHandler);

    // goto protected page
    const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
    // sign in (after redirect)
    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "booking@avalancheofcheese.com");
    const passwordField = screen.getByLabelText(/password/i);
    userEvent.type(passwordField, "iheartcheese"); //  not testing server! see msw handlers
    // <Form data-testid={"sign-in-form"} />
    const signInOrSignUpForm = screen.getByTestId("sign-in-form");
    // ...look in above component tree
    const signInOrSignUpButton = getByRole(signInOrSignUpForm, "button", {
      name: buttonNameRegex,
    });
    // initially fail
    userEvent.click(signInOrSignUpButton);
    // setup default
    server.resetHandlers();
    userEvent.click(signInOrSignUpButton);
    // async test assertions, we need to wait for response
    await waitFor(() => {
      expect(history.location.pathname).toBe("/tickets/1");
      // remove sign in from history
      // console.log(history);
      expect(history.entries).toHaveLength(1);
    });
  }
);

/** 1 parametrization */
// test("successful sign-in happyflowpath", async () => {
//   // goto protected page
//   const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
//   // sign in (after redirect)
//   const emailField = screen.getByLabelText(/email/i);
//   // userEvent.type(emailField, "test@test.com");
//   userEvent.type(emailField, "booking@avalancheofcheese.com");
//   //
//   const passwordField = screen.getByLabelText(/password/i);
//   // userEvent.type(passwordField, "test"); //  not testing server!
//   userEvent.type(passwordField, "iheartcheese"); //  not testing server!

//   // <Form data-testid={"sign-in-form"} />
//   const signInForm = screen.getByTestId("sign-in-form");
//   // ...in above component
//   const signInButton = getByRole(signInForm, "button", {
//     name: /sign in/i,
//   });
//   userEvent.click(signInButton);

//   // async test assertions, we need to wait for response
//   await waitFor(() => {
//     expect(history.location.pathname).toBe("/tickets/1");
//     // remove sign in from history
//     // console.log(history);
//     expect(history.entries).toHaveLength(1);
//   });
//   //
// });

// test("successful sign-up happyflowpath", async () => {
//   // goto protected page
//   const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
//   // sign in (after redirect)
//   const emailField = screen.getByLabelText(/email/i);
//   // userEvent.type(emailField, "test@test.com");
//   userEvent.type(emailField, "booking@avalancheofcheese.com");
//   const passwordField = screen.getByLabelText(/password/i);
//   // userEvent.type(passwordField, "test"); //  not testing server!
//   userEvent.type(passwordField, "iheartcheese"); //  not testing server!

//   // <Form data-testid={"sign-in-form"} />
//   // const signUpForm = screen.getByTestId("sign-in-form");
//   // ...in above component

//   // ... only one on page
//   const signUpButton = screen.getByRole("button", {
//     name: /sign up/i,
//   });
//   userEvent.click(signUpButton);

//   // async test assertions, we need to wait for response
//   await waitFor(() => {
//     expect(history.location.pathname).toBe("/tickets/1");
//     // remove sign in from history
//     // console.log(history);
//     expect(history.entries).toHaveLength(1);
//   });
//   //
// });

/** 2 parametrization */
// test("unsuccessful signin server error followed by successful signin happypathflow", async () => {
//   // overrule default server.handler
//   const errorHandler = rest.post(`${baseUrl}/${endpoints.signIn}`, serverError);
//   server.resetHandlers(...handlers, errorHandler);

//   //
//   // goto protected page
//   const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
//   // sign in (after redirect)
//   const emailField = screen.getByLabelText(/email/i);
//   userEvent.type(emailField, "booking@avalancheofcheese.com");
//   const passwordField = screen.getByLabelText(/password/i);
//   userEvent.type(passwordField, "iheartcheese"); //  not testing server! see msw handlers
//   // <Form data-testid={"sign-in-form"} />
//   const signInForm = screen.getByTestId("sign-in-form");
//   // ...look in above component tree
//   const signInButton = getByRole(signInForm, "button", {
//     name: /sign in/i,
//   });
//   // invoke errorHanlder fail
//   userEvent.click(signInButton);

//   //
//   //
//   server.resetHandlers();
//   userEvent.click(signInButton);
//   // async test assertions, we need to wait for response
//   await waitFor(() => {
//     expect(history.location.pathname).toBe("/tickets/1");
//     // remove sign in from history
//     // console.log(history);
//     expect(history.entries).toHaveLength(1);
//   });
// });

// test("unsuccessful signin followed by successful signin happypathflow", async () => {
//   // overrule default server.handler
//   const errorHandler = rest.post(
//     `${baseUrl}/${endpoints.signIn}`,
//     signInFailure
//   );
//   //
//   server.resetHandlers(...handlers, errorHandler);

//   // goto protected page
//   const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
//   // sign in (after redirect)
//   const emailField = screen.getByLabelText(/email/i);
//   userEvent.type(emailField, "booking@avalancheofcheese.com");
//   const passwordField = screen.getByLabelText(/password/i);
//   userEvent.type(passwordField, "iheartcheese"); //  not testing server! see msw handlers
//   // <Form data-testid={"sign-in-form"} />
//   const signInForm = screen.getByTestId("sign-in-form");
//   // ...look in above component tree
//   const signInButton = getByRole(signInForm, "button", {
//     name: /sign in/i,
//   });
//   // initially fail
//   userEvent.click(signInButton);
//   // setup default
//   server.resetHandlers();
//   userEvent.click(signInButton);
//   // async test assertions, we need to wait for response
//   await waitFor(() => {
//     expect(history.location.pathname).toBe("/tickets/1");
//     // remove sign in from history
//     // console.log(history);
//     expect(history.entries).toHaveLength(1);
//   });
// });
