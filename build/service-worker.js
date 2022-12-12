/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-0b008d8b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "0c2fe8b19affa6a132a9.png",
    "revision": null
  }, {
    "url": "26d37ca54a5d551da22c.gif",
    "revision": null
  }, {
    "url": "2b3e1faf89f94a4835397e7a43b4f77d.png",
    "revision": null
  }, {
    "url": "416d91365b44e4b4f4777663e6f009f3.png",
    "revision": null
  }, {
    "url": "42e88a566f5f3c20f5563dc1dd6828da.gif",
    "revision": null
  }, {
    "url": "6d5ba9a15bef9cdf3d82.png",
    "revision": null
  }, {
    "url": "80aa8fdf6f5a0bcb6a92.png",
    "revision": null
  }, {
    "url": "8f2c4d11474275fbc1614b9098334eae.png",
    "revision": null
  }, {
    "url": "assets/favicon.ico",
    "revision": "0a5cc15d5394ecfd28d42cab83e6e976"
  }, {
    "url": "b110a6248f50f33e02d1774dad7019e6.png",
    "revision": null
  }, {
    "url": "de35b003b6a8d1bb27a1.png",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "ff53c6071466375fbd922aa7c5e22ed6"
  }, {
    "url": "js/built.js",
    "revision": "1884a78eff07660f234fbeb96b474b80"
  }], {});

}));
