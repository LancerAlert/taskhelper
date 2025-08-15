// Task My Page JavaScript - CLAUDE.md Compliant
document.addEventListener('DOMContentLoaded', function() {

  // Initialize tooltips for status badges
  initializeStatusTooltips();
  
  // Setup task action handlers
  setupTaskActionHandlers();
  
  // Initialize notification system
  initializeNotifications();
});

// Alpine.js Component for Task Management
function myTasksManager() {
  return {
    // State Management
    activeView: 'posted', // 'posted' or 'completed'
    postedFilter: 'all',  // Filter for posted tasks
    completedFilter: 'all',  // Filter for completed tasks
    get statusFilter() {
      // Return the appropriate filter based on active view
      return this.activeView === 'posted' ? this.postedFilter : this.completedFilter;
    },
    set statusFilter(value) {
      // Set the appropriate filter based on active view
      if (this.activeView === 'posted') {
        this.postedFilter = value;
      } else {
        this.completedFilter = value;
      }
    },
    isLoading: false,
    
    // Mock data (replace with API calls)
    stats: {
      totalTasks: 23,
      completedTasks: 18,
      earnings: 45000,
      rating: 4.8
    },
    
    tasks: {
      posted: [
        {
          id: 1,
          title: '近所のスーパーで買い物代行',
          status: 'recruiting',
          category: 'shopping',
          price: 2500,
          location: '渋谷区',
          applicants: 5,
          createdAt: '3日前'
        },
        {
          id: 2,
          title: 'アパートの清掃代行',
          status: 'in-progress',
          category: 'cleaning',
          price: 8000,
          location: '新宿区',
          applicants: 0,
          createdAt: '1週間前'
        },
        {
          id: 3,
          title: '書類配達依頼',
          status: 'pending-payment',
          category: 'delivery',
          price: 3000,
          location: '港区',
          applicants: 0,
          createdAt: '2週間前'
        }
      ],
      completed: [
        {
          id: 4,
          title: 'ペット散歩代行',
          status: 'rated',
          category: 'petcare',
          price: 1500,
          location: '世田谷区',
          rating: 5.0,
          completedAt: '1週間前'
        },
        {
          id: 5,
          title: '家電修理サービス',
          status: 'unrated',
          category: 'repairs',
          price: 12000,
          location: '目黒区',
          completedAt: '3日前'
        }
      ]
    },

    // Methods
    switchView(view) {
      this.activeView = view;
      // Don't reset filters when switching views - maintain separate filter states
      
      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'view_switch', {
          event_category: 'Task Management',
          event_label: view
        });
      }
    },

    filterByStatus(status) {
      this.statusFilter = status;
      
      // Show loading state for better UX
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },

    getFilteredTasks() {
      const currentTasks = this.tasks[this.activeView] || [];
      
      if (this.statusFilter === 'all') {
        return currentTasks;
      }
      
      // Map filter values to task status values
      const statusMapping = {
        // Posted tab filters
        'recruiting': 'recruiting',
        'in-progress': 'in-progress', 
        'pending-payment': 'pending-payment',
        // Completed tab filters
        'rated': 'rated',
        'unrated': 'unrated'
      };
      
      const mappedStatus = statusMapping[this.statusFilter] || this.statusFilter;
      return currentTasks.filter(task => task.status === mappedStatus);
    },

    // Task Actions
    viewTaskDetail(taskId) {
      window.location.href = `/tasks/detail/${taskId}`;
    },

    editTask(taskId) {
      if (this.activeView === 'posted') {
        window.location.href = `/tasks/edit/${taskId}`;
      } else {
        if (typeof toastr !== 'undefined') {
          toastr.info('応募内容の編集機能は準備中です', '開発中');
        }
      }
    },

    editTaskWithWarning(taskId, applicantCount) {
      if (applicantCount > 0) {
        // Show warning message when there are applicants
        const message = `この依頼には${applicantCount}名の応募者がいます。\n編集すると全ての応募者がリセットされます。\n\n続行しますか？`;
        
        if (confirm(message)) {
          window.location.href = `/tasks/edit/${taskId}`;
        }
      } else {
        // No applicants, proceed directly
        window.location.href = `/tasks/edit/${taskId}`;
      }
    },

    viewApplicants(taskId) {
      // Navigate to application page for the specific task
      window.location.href = `/tasks/${taskId}/application`;
    },

    deleteTask(taskId) {
      if (confirm('本当に削除しますか？この操作は取り消せません。')) {
        // Show loading state
        this.isLoading = true;
        
        // Simulate API call
        setTimeout(() => {
          // Remove task from array
          const taskIndex = this.tasks[this.activeView].findIndex(t => t.id === taskId);
          if (taskIndex > -1) {
            this.tasks[this.activeView].splice(taskIndex, 1);
          }
          
          this.isLoading = false;
          if (typeof toastr !== 'undefined') {
            toastr.success('タスクが削除されました');
          }
        }, 500);
      }
    },

    cancelApplication(taskId) {
      if (confirm('応募をキャンセルしますか？この操作は取り消せません。')) {
        this.isLoading = true;
        
        setTimeout(() => {
          const taskIndex = this.tasks.applied.findIndex(t => t.id === taskId);
          if (taskIndex > -1) {
            this.tasks.applied.splice(taskIndex, 1);
          }
          
          this.isLoading = false;
          if (typeof toastr !== 'undefined') {
            toastr.success('応募がキャンセルされました');
          }
        }, 500);
      }
    },

    // Utility Methods
    formatPrice(price) {
      return `¥${price.toLocaleString()}`;
    },

    getStatusBadgeClass(status) {
      const statusClasses = {
        'recruiting': 'bg-green-100 text-green-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        'pending-payment': 'bg-orange-100 text-orange-800',
        'rated': 'bg-blue-100 text-blue-800',
        'unrated': 'bg-orange-100 text-orange-800',
        'cancelled': 'bg-red-100 text-red-800'
      };
      
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    },

    getCategoryIcon(category) {
      const categoryIcons = {
        'shopping': 'fas fa-shopping-cart',
        'cleaning': 'fas fa-broom',
        'delivery': 'fas fa-truck',
        'petcare': 'fas fa-paw',
        'repairs': 'fas fa-tools',
        'others': 'fas fa-ellipsis-h'
      };
      
      return categoryIcons[category] || 'fas fa-tasks';
    }
  };
}

// Status Badge Tooltips
function initializeStatusTooltips() {
  const statusTooltips = {
    '募集中': '現在応募者を募集しています',
    '選考中': '依頼者が応募者を選考中です',
    '採用決定': 'あなたが選ばれました！',
    '進行中': '作業が進行中です',
    '完了': '作業が完了しました',
    '完了済み': '作業が完了しました',
    'キャンセル': '残念ながら選ばれませんでした',
    '不採用': '残念ながら選ばれませんでした'
  };

  document.addEventListener('mouseenter', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('status-badge')) {
      const status = e.target.textContent.trim();
      const tooltip = statusTooltips[status];
      
      if (tooltip) {
        e.target.setAttribute('title', tooltip);
      }
    }
  }, true);
}

// Task Action Handlers
function setupTaskActionHandlers() {
  document.addEventListener('click', function(e) {
    const target = e.target.closest('button');
    if (!target) return;

    const buttonText = target.textContent.trim();

    // Skip filter buttons (they have x-data attributes)
    if (target.closest('[x-data]') && target.hasAttribute('@click')) {
      return;
    }

    // Handle different button actions
    if (buttonText.includes('詳細')) {
      handleTaskDetail(target);
    } else if (buttonText.includes('編集')) {
      handleTaskEdit(target);
    } else if (buttonText.includes('削除') || target.querySelector('i.fa-trash')) {
      handleTaskDelete(target);
    } else if (target.querySelector('i.fa-times')) {
      handleApplicationCancel(target);
    } else if (buttonText.includes('評価')) {
      handleTaskReview(target);
    } else if (buttonText.includes('新しい依頼を作成')) {
      window.location.href = '/tasks/create';
    } else if (buttonText.includes('案件を探す')) {
      window.location.href = '/tasks/list';
    }
  });
}

// Individual Action Handlers
function handleTaskDetail(button) {
  // Extract task ID from data attribute or navigate to detail page
  window.location.href = '/tasks/detail/1';
}

function handleTaskEdit(button) {
  if (typeof toastr !== 'undefined') {
    toastr.info('編集機能は準備中です', '開発中');
  }
}

function handleTaskDelete(button) {
  if (confirm('本当に削除しますか？この操作は取り消せません。')) {
    if (typeof toastr !== 'undefined') {
      toastr.success('タスクが削除されました');
    }
    // Handle actual deletion logic here
  }
}

function handleApplicationCancel(button) {
  if (confirm('応募をキャンセルしますか？この操作は取り消せません。')) {
    if (typeof toastr !== 'undefined') {
      toastr.success('応募がキャンセルされました');
    }
    // Handle actual cancellation logic here
  }
}

function handleTaskReview(button) {
  if (typeof toastr !== 'undefined') {
    toastr.info('評価・レビュー機能は準備中です', '開発中');
  }
}

// Notification System
function initializeNotifications() {
  // Configure toastr settings
  if (typeof toastr !== 'undefined') {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      onclick: null,
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 5000,
      extendedTimeOut: 1000,
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
  }
}

// Utility Functions
function showLoading() {
  // Show loading state
  document.body.style.cursor = 'wait';
}

function hideLoading() {
  // Hide loading state
  document.body.style.cursor = 'default';
}

// Analytics Tracking (if Google Analytics is available)
function trackTaskAction(action, taskId) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'Task Management',
      event_label: taskId.toString()
    });
  }
}

// Error Handling
window.addEventListener('error', function(e) {
  console.error('Task My Page Error:', e.error);
  
  // Check if toastr is available
  if (typeof toastr !== 'undefined' && toastr.error) {
    toastr.error('エラーが発生しました。ページを更新してください。', 'エラー');
  }
});

// Make functions globally available for Alpine.js
window.myTasksManager = myTasksManager;