// Helper Dashboard JavaScript - CLAUDE.md Compliant
document.addEventListener('DOMContentLoaded', function() {

  // Initialize tooltips for helper-specific status badges
  initializeHelperStatusTooltips();
  
  // Setup helper task action handlers
  setupHelperTaskActionHandlers();
  
  // Initialize notification system
  initializeNotifications();
});

// Alpine.js Component for Helper Task Management
function helperTasksManager() {
  return {
    // State Management
    activeView: 'applied', // 'applied' or 'completed'
    appliedFilter: 'all',  // Filter for applied tasks
    completedFilter: 'all',  // Filter for completed tasks
    get statusFilter() {
      // Return the appropriate filter based on active view
      return this.activeView === 'applied' ? this.appliedFilter : this.completedFilter;
    },
    set statusFilter(value) {
      // Set the appropriate filter based on active view
      if (this.activeView === 'applied') {
        this.appliedFilter = value;
      } else {
        this.completedFilter = value;
      }
    },
    isLoading: false,
    
    // Helper-specific mock data (replace with API calls)
    stats: {
      appliedTasks: 15,
      completedTasks: 12,
      totalEarnings: 45000,
      avgRating: 4.9
    },
    
    tasks: {
      applied: [
        {
          id: 1,
          title: '書類配達代行',
          description: '重要書類を港区から品川区まで確実にお届けください。',
          status: 'pending',
          category: 'delivery',
          price: 3000,
          location: '港区→品川区',
          competitors: 3,
          appliedAt: '2日前'
        },
        {
          id: 2,
          title: '家電修理サービス',
          description: '洗濯機の故障修理をお願いします。電源が入らない状態です。',
          status: 'accepted',
          category: 'repairs',
          price: 8000,
          location: '目黒区',
          scheduledFor: '明日',
          acceptedAt: '1週間前'
        },
        {
          id: 5,
          title: 'アパート掃除代行',
          description: '2LDKアパートの全体清掃をお願いします。キッチン、バスルーム、リビング等を含みます。',
          status: 'in-progress',
          category: 'cleaning',
          price: 6000,
          location: '世田谷区',
          startedAt: '今日開始'
        }
      ],
      completed: [
        {
          id: 3,
          title: 'スーパーでの買い物代行',
          description: '日用品と食材の購入をお願いします。買い物リストをお渡しします。',
          status: 'paid',
          category: 'shopping',
          price: 2000,
          location: '渋谷区',
          rating: 5.0,
          completedAt: '2週間前',
          earnings: 2000,
          requesterRated: true,
          requesterRating: 4.5
        },
        {
          id: 4,
          title: '家具組み立て代行',
          description: 'IKEA家具（デスクとチェア）の組み立てをお願いします。',
          status: 'pending-payment',
          category: 'others',
          price: 5000,
          location: '品川区',
          rating: 4.8,
          completedAt: '3日前',
          earnings: 5000,
          requesterRated: false
        }
      ]
    },

    // Methods
    switchView(view) {
      this.activeView = view;
      // Don't reset filters when switching views - maintain separate filter states
      
      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'helper_view_switch', {
          event_category: 'Helper Dashboard',
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
        // Applied tab filters
        'pending': 'pending',
        'accepted': 'accepted',
        'in-progress': 'in-progress',
        'rejected': 'rejected',
        // Completed tab filters  
        'paid': 'paid',
        'pending-payment': 'pending-payment'
      };
      
      const mappedStatus = statusMapping[this.statusFilter] || this.statusFilter;
      return currentTasks.filter(task => task.status === mappedStatus);
    },

    // Helper-specific Task Actions
    viewTaskDetail(taskId) {
      window.location.href = `/tasks/detail/${taskId}`;
    },

    editApplication(taskId) {
      if (typeof toastr !== 'undefined') {
        toastr.info('応募編集機能は準備中です', '開発中');
      }
    },

    contactRequester(taskId) {
      if (typeof toastr !== 'undefined') {
        toastr.info('依頼者との連絡機能は準備中です', '開発中');
      }
    },

    reportProgress(taskId) {
      if (typeof toastr !== 'undefined') {
        toastr.info('進捗報告機能は準備中です', '開発中');
      }
    },

    rateRequester(taskId) {
      if (typeof toastr !== 'undefined') {
        toastr.info('依頼者評価機能は準備中です', '開発中');
      }
      // Simulate rating action
      // In production, this would open a rating modal/page
      // For now, just mark as rated
      const task = this.tasks.completed.find(t => t.id === taskId);
      if (task) {
        task.requesterRated = true;
        task.requesterRating = 4.0; // Sample rating
      }
    },

    viewRating(taskId) {
      const task = this.tasks.completed.find(t => t.id === taskId);
      if (task && task.requesterRating) {
        if (typeof toastr !== 'undefined') {
          toastr.info(`依頼者への評価: ${task.requesterRating}/5.0`, '評価確認');
        }
      }
    },

    confirmLocation(taskId) {
      if (typeof toastr !== 'undefined') {
        toastr.info('場所確認機能は準備中です', '開発中');
      }
    },

    viewEarnings(taskId) {
      const task = this.tasks.completed.find(t => t.id === taskId);
      if (task) {
        if (typeof toastr !== 'undefined') {
          toastr.success(`収入: ¥${task.earnings.toLocaleString()}`, '収入確認');
        }
      } else {
        if (typeof toastr !== 'undefined') {
          toastr.info('収入詳細機能は準備中です', '開発中');
        }
      }
    },

    withdrawApplication(taskId) {
      if (confirm('応募を取り下げますか？この操作は取り消せません。')) {
        // Show loading state
        this.isLoading = true;
        
        // Simulate API call
        setTimeout(() => {
          // Remove task from applied array
          const taskIndex = this.tasks.applied.findIndex(t => t.id === taskId);
          if (taskIndex > -1) {
            this.tasks.applied.splice(taskIndex, 1);
          }
          
          this.isLoading = false;
          if (typeof toastr !== 'undefined') {
            toastr.success('応募を取り下げました');
          }
        }, 500);
      }
    },

    // Utility Methods
    formatPrice(price) {
      return `¥${price.toLocaleString()}`;
    },

    getHelperStatusBadgeClass(status) {
      const statusClasses = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'accepted': 'bg-green-100 text-green-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        'rejected': 'bg-red-100 text-red-800',
        'paid': 'bg-green-100 text-green-800',
        'pending-payment': 'bg-orange-100 text-orange-800'
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
    },

    getStatusText(status) {
      const statusTexts = {
        'pending': '選考中',
        'accepted': '採用決定',
        'rejected': '不採用',
        'completed': '完了済み'
      };
      
      return statusTexts[status] || '不明';
    }
  };
}

// Helper Status Badge Tooltips
function initializeHelperStatusTooltips() {
  const helperStatusTooltips = {
    '選考中': '依頼者があなたの応募を検討中です',
    '採用決定': 'おめでとうございます！あなたが選ばれました',
    '不採用': '残念ながら今回は選ばれませんでした',
    '完了済み': '作業が正常に完了しました'
  };

  document.addEventListener('mouseenter', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('status-badge')) {
      const status = e.target.textContent.trim();
      const tooltip = helperStatusTooltips[status];
      
      if (tooltip) {
        e.target.setAttribute('title', tooltip);
      }
    }
  }, true);
}

// Helper Task Action Handlers
function setupHelperTaskActionHandlers() {
  document.addEventListener('click', function(e) {
    const target = e.target.closest('button');
    if (!target) return;

    const buttonText = target.textContent.trim();

    // Skip filter buttons (they have x-data attributes)
    if (target.closest('[x-data]') && target.hasAttribute('@click')) {
      return;
    }

    // Handle different helper-specific button actions
    if (buttonText.includes('詳細')) {
      handleHelperTaskDetail(target);
    } else if (buttonText.includes('応募編集')) {
      handleEditApplication(target);
    } else if (buttonText.includes('連絡')) {
      handleContactRequester(target);
    } else if (buttonText.includes('場所確認')) {
      handleConfirmLocation(target);
    } else if (buttonText.includes('評価確認')) {
      handleViewRating(target);
    } else if (buttonText.includes('収入確認') || buttonText.includes('収入を確認')) {
      handleViewEarnings(target);
    } else if (buttonText.includes('新しい案件を探す')) {
      window.location.href = '/tasks/list';
    } else if (target.querySelector('i.fa-times')) {
      handleWithdrawApplication(target);
    }
  });
}

// Individual Helper Action Handlers
function handleHelperTaskDetail(button) {
  window.location.href = '/tasks/detail/1';
}

function handleEditApplication(button) {
  if (typeof toastr !== 'undefined') {
    toastr.info('応募編集機能は準備中です', '開発中');
  }
}

function handleContactRequester(button) {
  if (typeof toastr !== 'undefined') {
    toastr.info('依頼者との連絡機能は準備中です', '開発中');
  }
}

function handleConfirmLocation(button) {
  if (typeof toastr !== 'undefined') {
    toastr.info('場所確認機能は準備中です', '開発中');
  }
}

function handleViewRating(button) {
  if (typeof toastr !== 'undefined') {
    toastr.info('評価詳細機能は準備中です', '開発中');
  }
}

function handleViewEarnings(button) {
  window.location.href = '/helper/earnings';
}

function handleWithdrawApplication(button) {
  if (confirm('応募を取り下げますか？この操作は取り消せません。')) {
    if (typeof toastr !== 'undefined') {
      toastr.success('応募を取り下げました');
    }
    // Handle actual withdrawal logic here
  }
}

// Notification System
function initializeNotifications() {
  // Configure toastr settings for helper dashboard
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
function showHelperLoading() {
  document.body.style.cursor = 'wait';
}

function hideHelperLoading() {
  document.body.style.cursor = 'default';
}

// Helper-specific Analytics Tracking
function trackHelperAction(action, taskId) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'Helper Dashboard',
      event_label: taskId.toString()
    });
  }
}

// Helper Earnings Calculator
function calculateTotalEarnings(completedTasks) {
  return completedTasks.reduce((total, task) => total + (task.earnings || 0), 0);
}

// Helper Rating Calculator
function calculateAverageRating(completedTasks) {
  const ratedTasks = completedTasks.filter(task => task.rating);
  if (ratedTasks.length === 0) return 0;
  
  const totalRating = ratedTasks.reduce((sum, task) => sum + task.rating, 0);
  return (totalRating / ratedTasks.length).toFixed(1);
}

// Error Handling
window.addEventListener('error', function(e) {
  console.error('Helper Dashboard Error:', e.error);
  if (typeof toastr !== 'undefined') {
    toastr.error('エラーが発生しました。ページを更新してください。', 'エラー');
  }
});

// Make functions globally available for Alpine.js
window.helperTasksManager = helperTasksManager;