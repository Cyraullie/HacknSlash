const path = require('path');

module.exports = { 
  mode: 'development', // Vous pouvez également utiliser 'production' ou 'none' en fonction de vos besoins.
  entry: {
    bundle: [
      path.resolve(__dirname, 'assets/js/main.js'),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "."),
  },
  devServer: {
    port: 8380,
    static: {
      directory: path.resolve(__dirname, '.'), // Dossier de sortie à servir
    },
  },
};