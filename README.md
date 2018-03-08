## Artbook

Procedurally generated art experiments written in JavaScript.
Check them out at [https://b-gran.github.io/artbook/](https://b-gran.github.io/artbook/).

### Running yourself
```
git clone https://github.com/b-gran/artbook.git
cd artbook
npm i
npm start

# The project is now accessible at http://localhost:3000
```

### Publishing

```
# Clean out the GH Pages branch and populate from build/ folder
git ls-files | grep -v '\.gitignore' | xargs rm && cp -R build/* .
```
