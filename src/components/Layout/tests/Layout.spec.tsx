import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Layout from "../Layout";
import { Provider } from "react-redux";
import store from "@/redux/storage";

describe("Test Layout", () => {
  it("Should render Layout", async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Layout>
            <h1>Test Layout</h1>
          </Layout>
        </Provider>
      );
    });

    expect(screen.getByText("Test Layout")).toBeInTheDocument();
  });
});
