/** @param {import('eslint').Rule.Node} node */
function hasRefAccessor(node) {
  return (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.object.type === "Identifier" &&
    node.object.name === "ref" &&
    node.property.type === "Identifier" &&
    node.property.name === "current"
  );
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Disallow ref accessors in render effects",
    },
    schema: [],
  },
  create: (context) => {
    let withinRenderEffect = false;

    /** @type {Set<string>} */
    const refVariables = new Set();

    return {
      // Track useRef declarations
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === "CallExpression" &&
          node.init.callee.type === "Identifier" &&
          node.init.callee.name === "useRef"
        ) {
          if (node.id.type === "Identifier") {
            refVariables.add(node.id.name);
          }
        }
      },

      // Detect when we enter a useRenderEffect callback
      /** @param {import('estree').CallExpression} node */
      'CallExpression[callee.name="useRenderEffect"]'(node) {
        const callback = node.arguments[0];
        if (callback) {
          withinRenderEffect = true;
        }
      },

      // Reset the flag when we exit the callback
      'CallExpression[callee.name="useRenderEffect"]:exit'() {
        withinRenderEffect = false;
      },

      // Check for ref.current access
      MemberExpression(node) {
        if (!withinRenderEffect) return;

        if (hasRefAccessor(node) && refVariables.has(node.object.name)) {
          context.report({
            node,
            message:
              "Accessing or modifying ref.current is not allowed within useRenderEffect callbacks. If you need to access/modify the ref, use useEffect instead.",
          });
        }
      },
    };
  },
};
