const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: "development",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                use: {
                    loader: "raw-loader"
                }
            },
            {
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                use: {
                    loader: "glslify-loader"
                }
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3002
    }
};
