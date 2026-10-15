function importMetaEnvPlugin({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        const { node } = path;
        if (
          t.isMetaProperty(node.object) &&
          node.object.meta.name === 'import' &&
          node.object.property.name === 'meta' &&
          node.property.name === 'env'
        ) {
          path.replaceWith(t.memberExpression(t.identifier('process'), t.identifier('env')));
        }
      },
    },
  };
}

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [importMetaEnvPlugin],
};
