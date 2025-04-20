import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): Assertion;
      toBeVisible(): Assertion;
      toBeDisabled(): Assertion;
      toHaveTextContent(text: string): Assertion;
    }
  }
}
