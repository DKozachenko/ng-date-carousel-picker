# ng-date-carousel-picker

A monorepository with:

* [ng-date-carousel-picker](./libs/ng-date-carousel-picker/README.md) - Angular library with custom date picker, which differs from other similar components in design, scroll and calendar in the end of period (if specific property set to `true`)
* [ng-date-carousel-picker-demo](./apps/ng-date-carousel-picker-demo/README.md) - demo application for `ng-date-carousel-picker` library which represents some examples 

## Storybook

#### Serving

* `ng-date-carousel-picker`: 
```bash
npm i
npm run picker:storybook
```

Storybook will open at `http://localhost:4400`.

#### Building

* `ng-date-carousel-picker`: 
```bash
npm i
npm run picker:build-storybook
```

Bundle will be in `dist/storybook/ng-date-carousel-picker` folder.

#### With Docker

* `ng-date-carousel-picker`: 
```bash
docker build . -t picker-storybook-image  -f libs/ng-date-carousel-picker/Dockerfile.storybook
docker run -d -p 4400:80 picker-storybook-image:latest
```

Storybook can be opened at `http://localhost:4400`.

## Build in production mode

* `ng-date-carousel-picker`: 
```bash
npm i
npm run picker:build
```
Bundle will be in `dist/libs/ng-date-carousel-picker` folder.

* `ng-date-carousel-picker-demo`: 
```bash
npm i
npm run demo:build
```
Bundle will be in `dist/apps/ng-date-carousel-picker-demo` folder.

## Demo

#### Serving

* `ng-date-carousel-picker-demo`: 
```bash
npm i
npm run demo:serve
```

#### With Docker

* `ng-date-carousel-picker-demo`: 
```bash
docker build . -t picker-demo-image  -f apps/ng-date-carousel-picker-demo/Dockerfile.demo
docker run -d -p 4200:80 picker-demo-image:latest
```

Demo can be opened at `http://localhost:4200`.

## Publish

Update version in `libs/ng-date-carousel-picker/package.json`.

* `ng-date-carousel-picker`: 
```bash
npm i
npm run picker:build
npm run picker:publish
```

## Lint

* `ng-date-carousel-picker`: 
```bash
npm i
npm run picker:lint
```

* `ng-date-carousel-picker-demo`: 
```bash
npm i
npm run demo:lint
```

## Test

* `ng-date-carousel-picker`: 
```bash
npm i
npm run picker:test
```

## Contributing

If you have any suggestions, ideas, or problems, feel free to create an issue or PR.
