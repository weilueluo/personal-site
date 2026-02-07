# Translate

> Translate string in json file if it is not translated already

```
poetry install
poetry run main
```

After translating, go to https://transform.tools/json-to-typescript and paste the content of `personal-website/src/public/messages/en.json` to generate typescript types, then paste the generated types to `personal-website/src/shared/i18n/types.d.ts`
