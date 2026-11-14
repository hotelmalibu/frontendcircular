// CRA clears the selected build directory; use BUILD_PATH to validate elsewhere.
process.env.GENERATE_SOURCEMAP = 'false';
require('react-scripts/scripts/build');
