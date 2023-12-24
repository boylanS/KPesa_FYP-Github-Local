//Here we configure webpack to look at our
// source index.js file and bundle any imports into
// a single bundle file

const path = require("path") //we require the core node module path


//Here we are exporting an object
//that represents the configuration of webpack
module.exports = {
    mode: "development", //indicates development mode
    entry: "./src/index.js", //our entry file, where we want it to initially look for source file
    output: { //outputs an object
        path: path.resolve(__dirname, "dist"), //whatever file we want the output to be put into
                                              //we use the resolve method to resolve a new path
        filename: "bundle.js" //specifies file name for output
    },
    watch:true //watch property set to true so when changes are made, webpack will bundle new code
}

//Also altered package.json by adding
//build and setting it to webpack - when
//this script is run, it will look
//for webpack and run our configuration