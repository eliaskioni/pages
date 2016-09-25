/**
 * Created by francis on 12/09/2016.
 */

import { Directive } from '@angular/core';

/**
 * dummy directive to allow html-tag "sidebar"
 */
@Directive({ selector: 'sidebar'})
export class SidebarDirective {}


@Directive({ selector: 'bold'})
export class BoldDirective {}