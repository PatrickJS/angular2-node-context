// import 'core-js';
require('zone.js/dist/zone-node.js');
// require('zone.js/dist/long-stack-trace-zone');

import {Parse5DomAdapter} from 'angular2/src/platform/server/parse5_adapter';
Parse5DomAdapter.makeCurrent();

import {ORIGIN_URL} from 'angular2-universal/common';
import {bootstrap} from 'angular2-universal/dist/node/platform/node';
import {serializeDocument, parseDocument} from 'angular2-universal/dist/node/platform/document';

import {Component, ComponentRef, provide, enableProdMode} from 'angular2/core';
import {DOCUMENT} from 'angular2/platform/common_dom';
import {DomSharedStylesHost} from 'angular2/src/platform/dom/shared_styles_host';

enableProdMode();

@Component({
  selector: 'app',
  styles: [`
    div {
      background-color: black;
    }
  `],
  template: `
  <div>
    oh hai
  </div>
  `
})
class App {

}


export function main(document, originUrl) {
  return bootstrap(App, [
      provide(ORIGIN_URL, {useValue: originUrl}),
      provide(DOCUMENT, {
        useFactory: (domSharedStylesHost: DomSharedStylesHost) => {
          var doc: any = parseDocument(document);
          domSharedStylesHost.addHost(doc.head);
          return doc;
        },
        deps: [DomSharedStylesHost]
      })

    ])
    .then((cmpRef: ComponentRef) => {
      return serializeDocument(cmpRef.injector.get(DOCUMENT));
    });
};
