module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false
      }
    ]
  ],

  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ]
};
