// Alpine.js Task Detail Component
// Library-first approach following CLAUDE.md guidelines

document.addEventListener('alpine:init', () => {
  console.log('Registering taskDetail component');
  
  // Make function globally available for Alpine.js
  window.taskDetail = function taskDetail() {
    return {
      // UI state
      activeTab: 'description',
      isFavorited: false,
      
      // Initialize component
      initDetail() {
        console.log('Alpine.js task detail initialized');
        this.updateRelativeTimes();
        // Update relative times every minute
        setInterval(() => {
          this.updateRelativeTimes();
        }, 60000);
        
        this.initFloatingButton();
        this.setupAnimationObserver();
      },
      
      // Tab management
      setActiveTab(tab) {
        this.activeTab = tab;
      },
      
      // Favorite functionality
      toggleFavorite() {
        this.isFavorited = !this.isFavorited;
        if (this.isFavorited) {
          toastr.success('お気に入りに追加しました');
        } else {
          toastr.info('お気に入りから削除しました');
        }
      },
      
      // Share functionality
      shareTask() {
        if (navigator.share) {
          navigator.share({
            title: '買い物代行をお願いします - TaskHelper',
            text: 'この依頼をチェックしてみてください',
            url: window.location.href
          });
        } else {
          // Fallback for browsers that don't support navigator.share
          toastr.info('URLがクリップボードにコピーされました');
          navigator.clipboard.writeText(window.location.href);
        }
      },
      
      // Contact functionality
      contactRequester() {
        const taskId = 'task_shopping_001'; // Real environment: get from URL params
        const conversationId = 'conv_' + Math.random().toString(36).substr(2, 9);
        window.location.href = '/user/messages';
      },
      
      // Apply functionality using toastr instead of SweetAlert2
      applyToTask() {
        // Show confirmation with toastr
        toastr.options = {
          closeButton: true,
          timeOut: 0,
          extendedTimeOut: 0,
          tapToDismiss: false,
          onclick: (toast) => {
            // User clicked confirm
            toastr.clear();
            this.confirmApplication();
          }
        };
        
        toastr.info(`
          <div>
            <p><strong>この依頼に応募しますか？</strong></p>
            <p class="mt-2">応募後、依頼者とメッセージでやり取りができます。</p>
            <div class="mt-3 flex space-x-2">
              <button onclick="window.taskDetailInstance.confirmApplication()" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">応募する</button>
              <button onclick="toastr.clear()" class="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">キャンセル</button>
            </div>
          </div>
        `, '', {
          allowHtml: true
        });
      },
      
      // Confirm application
      confirmApplication() {
        toastr.success('応募完了！依頼への応募が完了しました。', '応募完了');
        
        // Ask about messaging
        setTimeout(() => {
          toastr.options = {
            closeButton: true,
            timeOut: 0,
            extendedTimeOut: 0,
            tapToDismiss: false
          };
          
          toastr.info(`
            <div>
              <p><strong>依頼者とメッセージでやり取りを開始しますか？</strong></p>
              <div class="mt-3 flex space-x-2">
                <button onclick="window.taskDetailInstance.goToMessages()" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">メッセージへ</button>
                <button onclick="toastr.clear()" class="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">後で</button>
              </div>
            </div>
          `, '', {
            allowHtml: true
          });
        }, 2000);
      },
      
      // Navigate to messages
      goToMessages() {
        toastr.clear();
        const taskId = 'task_' + Math.random().toString(36).substr(2, 9);
        const conversationId = 'conv_' + Math.random().toString(36).substr(2, 9);
        window.location.href = '/user/messages';
      },
      
      // Open image modal
      openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 image-modal';
        modal.innerHTML = `
          <div class="relative max-w-4xl max-h-full">
            <img src="${src}" alt="${alt}" class="max-w-full max-h-full rounded-lg">
            <button class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
        
        // Close on click
        modal.addEventListener('click', function(e) {
          if (e.target === modal || e.target.closest('button')) {
            modal.remove();
          }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
          if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
          }
        });
        
        document.body.appendChild(modal);
      },
      
      
      // Scroll to top
      scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      },
      
      // Initialize floating button
      initFloatingButton() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (!scrollToTopBtn) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
          if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
          } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
          }
        });
        
        // Initialize as hidden
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
        scrollToTopBtn.style.transition = 'all 0.3s ease';
      },
      
      // Setup animation observer
      setupAnimationObserver() {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('opacity-100', 'translate-y-0');
              entry.target.classList.remove('opacity-0', 'translate-y-4');
            }
          });
        }, observerOptions);
        
        // Observe all animation target elements
        document.querySelectorAll('[x-data]').forEach(element => {
          observer.observe(element);
        });
      },
      
      
      // Update relative times
      updateRelativeTimes() {
        const timeElements = document.querySelectorAll('.relative-time');
        const now = new Date();
        
        timeElements.forEach(element => {
          const timeStr = element.getAttribute('data-time');
          if (timeStr) {
            const time = new Date(timeStr);
            const diff = Math.floor((now - time) / 1000); // difference in seconds
            
            let relativeTime;
            if (diff < 60) {
              relativeTime = 'たった今';
            } else if (diff < 3600) {
              const minutes = Math.floor(diff / 60);
              relativeTime = `${minutes}分前に投稿`;
            } else if (diff < 86400) {
              const hours = Math.floor(diff / 3600);
              relativeTime = `${hours}時間前に投稿`;
            } else if (diff < 2592000) { // 30 days
              const days = Math.floor(diff / 86400);
              relativeTime = `${days}日前に投稿`;
            } else {
              // For very old posts, show actual date
              const year = time.getFullYear();
              const month = time.getMonth() + 1;
              const day = time.getDate();
              relativeTime = `${year}年${month}月${day}日に投稿`;
            }
            
            element.textContent = relativeTime;
          }
        });
      }
    };
  }; // End of taskDetail function
  
  // Configure toastr
  if (typeof toastr !== 'undefined') {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '3000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
  }
}); // End of alpine:init event listener

// Make instance globally available for HTML onclick handlers
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    window.taskDetailInstance = window.taskDetail();
  }, 100);
});

console.log('Alpine.js task detail component loaded');