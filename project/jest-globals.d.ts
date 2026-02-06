// Type definitions for Jest globals

declare global {
  namespace jest {
    interface Mock<T = any> {
      (...args: any[]): T;
      mock: {
        calls: any[][];
        instances: any[];
        contexts: any[];
        results: Array<{
          type: "return" | "throw";
          value: any;
        }>;
        lastCall: any[];
      };
      mockClear(): Mock<T>;
      mockReset(): Mock<T>;
      mockRestore(): void;
      mockImplementation(fn: (...args: any[]) => T): Mock<T>;
      mockImplementationOnce(fn: (...args: any[]) => T): Mock<T>;
      mockName(name: string): Mock<T>;
      mockReturnThis(): Mock<T>;
      mockReturnValue(val: T): Mock<T>;
      mockReturnValueOnce(val: T): Mock<T>;
      mockResolvedValue(val: any): Mock<T>;
      mockResolvedValueOnce(val: any): Mock<T>;
      mockRejectedValue(val: any): Mock<T>;
      mockRejectedValueOnce(val: any): Mock<T>;
    }

    // Simplify the Mocked interface to avoid complex type manipulation
    interface Mocked<T> {
      [key: string]: any;
    }

    function fn<T = any>(implementation?: (...args: any[]) => T): Mock<T>;
    function spyOn(object: any, method: string): Mock<any>;
    function mock(moduleName: string, factory?: any, options?: any): void;
    function clearAllMocks(): void;
    function resetAllMocks(): void;
    function restoreAllMocks(): void;
  }

  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function expect(value: any): any;
  function require(module: string): any;
}

export {};