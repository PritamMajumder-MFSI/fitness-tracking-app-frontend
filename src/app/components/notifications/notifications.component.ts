import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import {
  Notification,
  NotificationsResponse,
} from '../../../models/Notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  isDropdownOpen = false;
  notifications: Notification[] = [];
  currentPage = 1;
  notificationsPerPage = 5;
  isLoading = false;
  hasMoreNotifications = true;

  constructor(
    private backendService: BackendService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  async fetchNotifications() {
    if (this.isLoading || !this.hasMoreNotifications) return;

    this.isLoading = true;

    try {
      const res = await lastValueFrom(
        this.backendService.getApi<NotificationsResponse>('notifications', {
          page: this.currentPage.toString(),
          limit: this.notificationsPerPage.toString(),
        })
      );

      this.notifications = [...this.notifications, ...res.data.notifications];

      this.hasMoreNotifications =
        this.currentPage < res.data.pagination.totalPages;

      this.currentPage++;
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.currentPage = 1;
      this.notifications = [];
      this.hasMoreNotifications = true;
      this.fetchNotifications();
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.notification-container');

    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const bottomOfWindow =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    if (this.isDropdownOpen && bottomOfWindow) {
      this.fetchNotifications();
    }
  }
}
