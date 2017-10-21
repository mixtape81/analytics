module.exports = {
 "extends": "airbnb",
 "parser": "babel-eslint",
 "env": {
   "browser": true,
   "node": true,
   "es6": true,
   "mocha": true
 },
 "rules": {
   "import/no-extraneous-dependencies": ["error", {
     "devDependencies": [
       "spec/**",
     ]
   }],
   "comma-dangle": ["error", "never"]
 }
};