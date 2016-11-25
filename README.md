# Static website boilerplate
Modern static website boilerplate that comes with:
* Gulp based build system
* Webpack with Babel for ES2017 support
* Pug for HTML compiling
* Image optimization and minimizing for .jpeg .png .svg .gif files
* Assets revisioning in production build

## Installation
```shell
# Clone repository
git clone https://github.com/Genert/static-website-boilerplate.git

# Install dependencies
cd static-website-boilerplate && npm i
```

## Public tasks
The project comes with two public tasks to execute: `start` and `build`.

Use former when developing:
```shell
npm run start
```

Use latter for creating production ready build:
```shell
npm run build
```

The output is found in **public** folder in root.

## Contributions & Issues
Contributions are welcome. Please clearly explain the purpose of the PR and follow the current style.

Issues can be resolved quickest if they are descriptive and include both a reduced test case and a set of steps to reproduce.

## Licence
Licensed under the [MIT License © 2016 Genert](LICENSE).
