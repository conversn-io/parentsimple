## vercel.json merge needed

This repo already has a `vercel.json`. Please add this rewrite to it:

```json
{
  "source": "/:key([a-f0-9]{32}).txt",
  "has": [{ "type": "host", "value": "(?<currentHost>.*)" }],
  "destination": "/api/indexnow-key/:key"
}
```

Then delete this note file. Sitemap + IndexNow will start working.
