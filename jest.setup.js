// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom

require('@testing-library/jest-dom');

// Otras configuraciones de Jest si es necesario

import { setConfig, config } from "next/config";

// import "whatwg-fetch";

const instance = {};
// jest.mock("@utils/funcionesLogin", () => ({
//   signOutClickHandler: jest.fn(instance),
// }));
jest.mock("@azure/msal-react", () => ({
  useMsal: jest.fn(),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
