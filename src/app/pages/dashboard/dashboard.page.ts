import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  pageTitle: string = 'Dashboard'; // Default page title
  selectedPage: string = ''; // Initialize selectedPage property
  selectedMenuItem: string = ''; // Initialize selectedMenuItem property

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const childRoute = this.getChild(this.activatedRoute);
        if (childRoute && childRoute.snapshot.data) {
          const data = childRoute.snapshot.data as any;
          if (data.title) {
            this.pageTitle = data.title;
          } else {
            this.pageTitle = 'Dashboard';
          }
        } else {
          this.pageTitle = 'Dashboard';
        }
      }
    });
  }

  ngOnInit() {
    this.setSelectedMenuItem('User');
    // Retrieve selected menu item from local storage
    const storedMenuItem = localStorage.getItem('selectedMenuItem');
    if (storedMenuItem) {
      this.selectedMenuItem = storedMenuItem;
    }
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.getChild(route.firstChild);
    } else {
      return route;
    }
  }

  setPageTitle(title: string) {
    this.pageTitle = title;
  }

  setSelectedMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
    // Store selected menu item in local storage
    localStorage.setItem('selectedMenuItem', menuItem);
  }

}
