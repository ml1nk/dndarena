module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {},
        'cssnano': {
            discardComments: {
                removeAll: true
            }
        }
    }
}