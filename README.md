# HBS Academy back-office



## Getting started
This project serves as a back-office for HBS Academy. 



```
cd existing_repo
git remote add origin https://gitlab.uicgroup.tech/hbs/hbs-academy-backoffice.git
git branch -M master
git push -uf origin master
```

### 1. Building guide
- Use NodeJS version 18.0.0
- Clone the project
- Install dependencies: `npm install or yarn`
- Run the project: `npm run dev or yarn dev`
- Build the project: `npm run build or yarn build`
- Run the project: `npm run serve or yarn serve`

### 2. Project structure
- `src` - project root folder
- `src/assets` - project assets: images, fonts, etc.
- `src/components` - project components
- `public` - project images
- `src/layouts` - project layouts
- `src/pages` - project pages
- `src/modules` - project modules
- `src/stores` - project store
- `src/routes` - project routes
- `src/services` - project services
- `src/utils` - project utils

### 3. Project configuration
- `src/configs` - project configuration files
- `src/configs/axios.config.js` - axios configuration

### 4. Project environment variables
- `VITE_PUBLIC_API_URL` - API URL
- `VITE_PUBLIC_API_KEY` - API key

### 5. Project dependencies
- `axios` - Promise based HTTP client for the browser and node.js


### 6. Project dev dependencies
- `eslint` - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code
- `eslint-config-prettier` - Turns off all rules that are unnecessary or might conflict with Prettier
- `eslint-plugin-import` - ESLint plugin with rules that help validate proper imports
- `eslint-plugin-prettier` - Runs prettier as an eslint rule

### 7. Project scripts
- `dev` - run the project in development mode
- `build` - build the project
- `serve` - serve the project
- `lint` - lint the project

### 8. Project developers
- `Husanov Karombek` - Frontend Developer (maintainer)
- `Jamshid Tulaganov` - Frontend Developer (developer)

```