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
