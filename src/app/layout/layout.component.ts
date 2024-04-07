import { Component, AfterViewInit } from '@angular/core';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    jQuery(function ($) {
      "use strict";

      // Add active state to sidbar nav links
      var path = window.location.href;
      var links = document.querySelectorAll('#layoutSidenav_nav .sb-sidenav a.nav-link');
      links.forEach(function (link) {
        if ((link as HTMLAnchorElement).href === path) {
          link.classList.add("active");
        }
      });

      // Toggle the side navigation
      $("#sidebarToggle").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
      });
    });
  }


}
