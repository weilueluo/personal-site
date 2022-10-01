const babelConfig = {
    "presets": ["next/babel"],
    "plugins": ["preval", "macros"] // for pre-evaluate build time, to be shown in about page
}


module.exports = babelConfig

// https://github.com/facebook/relay/issues/2648#issuecomment-499250143