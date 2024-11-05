import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import {
  Notification,
  NotificationsResponse,
} from '../../../models/Notification';
import { ToastService } from '../../services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  isDropdownOpen = false;
  notifications: Notification[] = [];
  currentPage = 1;
  notificationsPerPage = 5;
  isLoading = false;
  hasMoreNotifications = true;

  @ViewChild('dropdown', { static: false }) dropdown!: ElementRef;

  constructor(
    private backendService: BackendService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService
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
      console.log(error);
      this.toastService.add('Error fetching notifications:', 3000, 'error');
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

  @HostListener('scroll', ['$event'])
  onDropdownScroll(event: Event) {
    const target = event.target as HTMLElement;
    const bottomOfDropdown =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (this.isDropdownOpen && bottomOfDropdown) {
      this.fetchNotifications();
    }
  }
}
