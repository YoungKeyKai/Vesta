export const redirectToLogin = (router) =>
  router
    .replace({
      pathname: '/login',
      query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
    })
    .catch(console.error);
