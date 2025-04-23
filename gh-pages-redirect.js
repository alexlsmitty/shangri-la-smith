// Handle GitHub Pages SPA routing
(function() {
  const l = window.location;
  if (l.search) {
    const q = {};
    l.search.slice(1).split('&').forEach(v => {
      const a = v.split('=');
      q[a[0]] = a[1];
    });
    if (q.redirect) {
      const path = q.redirect.replace(/~and~/g, '&');
      history.replaceState(null, null, 
        l.pathname.slice(0, -1) + (path.startsWith('/') ? path : '/' + path) + 
        (q.query ? ('?' + q.query) : '') + 
        l.hash
      );
    }
  }
})();
