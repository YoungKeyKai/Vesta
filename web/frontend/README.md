# Vesta

The frontend for the Vesta Sublet Webservice.

Built using
- React 18
- Next JS 
- Bootstrapped with Material Kit UI

## Development

To start a development server, run `npm run dev`.

Please see the recommended practices for developing next.js applications at [Next Docs](https://nextjs.org/docs).

API Requests are proxied to the backend. 
Create a file called `.env.local` and add the address of your Django Server.
If using localhost:8000, your env should look like 

```
NEXT_PUBLIC_API_ROOT=http://127.0.0.1:8000
```

Linting should be done using `npm run lint` or autoformatted with `npm run lint-fix`.
