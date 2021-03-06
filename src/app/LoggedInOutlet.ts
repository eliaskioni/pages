// import {Directive, Attribute, ElementRef, DynamicComponentLoader} from '@angular/core';
// import {Router, RouterOutlet, ComponentInstruction} from '@angular/router';
//
//
// @Directive({
//   selector: 'router-outlet'
// })
// export class LoggedInRouterOutlet extends RouterOutlet {
//   publicRoutes: any;
//   private parentRouter: Router;
//   checker: any;
//
//   constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader,
//               _parentRouter: Router, @Attribute('name') nameAttr: string) {
//     super(_elementRef, _loader, _parentRouter, nameAttr);
//
//     this.parentRouter = _parentRouter;
//     // The Boolean following each route below denotes whether the route requires authentication to view
//     this.publicRoutes = {
//       '/login': true,
//       'signup': true,
//       '/accounts/reset/': true
//     };
//
//   }
//
//   activate(instruction: ComponentInstruction) {
//     let url = instruction.urlPath;
//     console.log('url:' + url);
//     if (!this.publicRoutes[url] && !localStorage.getItem('jwt')) {
//       // todo: redirect to Login, may be there a better way?
//       this.parentRouter.navigate(['/home-page']);
//     }
//     return super.activate(instruction);
//   }
// }
