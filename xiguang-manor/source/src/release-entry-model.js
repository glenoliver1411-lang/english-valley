// A new document pathname, rather than a query parameter ignored by legacy
// workers, identifies each release. Its content-hashed dependencies remain coherent
// even while an older complete offline worker still controls the page.
export function releaseGameDocument(version){return version.startsWith('full-stage1')?'game-'+version.replace(/[^a-z0-9-]/gi,'-')+'.html':'index.html'}
export function releaseEntryURL(location,base){const target=new URL('enter-stage1.html',new URL(base,location.href));target.search=location.search;target.searchParams.delete('ready');target.hash=location.hash;return target.href}
export function releaseGameURL(location,base,version){const target=new URL(releaseGameDocument(version),new URL(base,location.href));target.search=location.search;target.searchParams.delete('v');target.searchParams.delete('ready');target.searchParams.set('build',version);target.hash=location.hash;return target.href}
