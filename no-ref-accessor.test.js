// enforce-foo-bar.test.js
import { RuleTester } from "eslint";
import noRefAccessor from "./no-ref-accessor.js";

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  languageOptions: { ecmaVersion: 2015 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "no-ref-accessor", // rule name
  noRefAccessor, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: "const ref = useRef(null); ref.current = 'foo';",
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: `
          const ref = useRef(null);

          useRenderEffect(() => {
            ref.current = 'foo';
          });
        `,
        errors: 1,
      },
      {
        code: `
          const ref = useRef(null);

          useRenderEffect(() => {
            ref.current.foo = 'bar';
          });
        `,
        errors: 1,
      },
    ],
  }
);

console.log("All tests passed!");
