> Take HTML from stdin and return PDF in stdout, using PhantomJS


## Getting Started

* Make sure PhantomJS is installed, i.e. `phantomjs -v` should return something useful.

* Install the module with `npm install pdfmaker`

* Create symlink with `npm link`


## Preparing your HTML

Have a look at `input/test.html`. Include `#global-hd` for a global header and `#global-ft` for a global footer. Global elements need to be self-contained, i.e. all styles and graphics have to be inline.

## Example usage (OSX)

`cat input/index.html | pdfmaker > output/test.pdf && open output/test.pdf`


## License
Licensed under the MIT license.
