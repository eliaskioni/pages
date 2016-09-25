/**
 * Created by kioni on 9/1/16.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {routes} from "./home/home_routes";
import {homepageRouter} from "./homepage/homepage.routing";

const appRoutes: Routes = [
  ...homepageRouter,
  ...routes
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
