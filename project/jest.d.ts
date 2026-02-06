// Basic type definitions for Jest

declare global {
  namespace jest {
    interface Mock<T = any> {
      (...args: any[]): T;
      mockClear(): void;
      mockReset(): void;
      mockRestore(): void;
      mockImplementation(fn: (...args: any[]) => T): jest.Mock<T>;
      mockReturnValue(val: T): jest.Mock<T>;
      mockResolvedValue(val: T): jest.Mock<T>;
      mockRejectedValue(val: any): jest.Mock<T>;
    }

    function fn<T = any>(): Mock<T>;
    function mock(moduleName: string): void;
    function clearAllMocks(): void;
  }

  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function expect(value: any): any;
}

// Define module for Jest
declare module 'jest' {
  export = jest;
}