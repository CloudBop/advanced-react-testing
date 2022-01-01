import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { ReactElement } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";

import { configureStoreWithMiddlewares, RootState } from "../app/store";

// add the history for assertions
type CustomRenderResult = RenderResult & { history: MemoryHistory };

type CustomRenderOptions = {
  preloadedState?: RootState;
  routeHistory?: Array<string>;
  initialRouteIndex?: number;
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

function render(
  ui: ReactElement,
  {
    preloadedState = {},
    routeHistory,
    initialRouteIndex,
    ...renderOptions
  }: CustomRenderOptions = {}
  //
): CustomRenderResult {
  //
  const history = createMemoryHistory({
    initialEntries: routeHistory,
    initialIndex: initialRouteIndex,
  });

  const Wrapper: React.FC = ({ children }) => {
    const store = configureStoreWithMiddlewares(preloadedState);
    return (
      <Provider store={store}>
        <Router history={history}>{children}</Router>
      </Provider>
    );
  };
  // the tree to assert on
  const rtlRenderObject = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });

  return { ...rtlRenderObject, history };
}
//
// overrule render method for testing redux provider

export * from "@testing-library/react";
export { render };
