export default {
    transform: {
      "^.+\\.js$": "babel-jest", // Use Babel to transform .js files
    },
    testEnvironment: "node", // Use Node environment
    setupFilesAfterEnv: ["<rootDir>/backend/__tests__/jest.setup.js"],
    testPathIgnorePatterns: ["/node_modules/", "/backend/__tests__/jest.setup.js"], // Ignore setup file as test
  };
  