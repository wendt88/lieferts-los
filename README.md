# Lieferts los
Liefer du amol soule

# Run:
```
git clone https://github.com/wendt88/lieferts-los
cd lieferts-los
npm i
npm run start
```

# Publish firebase functions
- `cd functions`
- `npm i`
- `firebase login`
- `firebase deploy --only functions`

# Publish firebase "static files" hosting
within main folder
- `npm i`
- `npm run build`
- `firebase deploy --only hosting`

# Multilanguage:
- add all labes to `labels` inside `client/hbs/<language>.hbs`
- use [`v-text`-directive](https://vuejs.org/v2/api/#v-text) to output a text not the `{{ ... }}`-syntax -> handlebars drfetzt olls los
