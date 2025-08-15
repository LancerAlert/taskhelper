/**
 * TaskHelper - Task List Page JavaScript
 * 依頼一覧ページ用JavaScript
 * 
 * Alpine.js を使用したリアクティブコンポーネント
 * CLAUDE.md 지침 준수: Library-First Policy, $nextTick 활용
 */

// Alpine.js Task List Data Component
function taskListData() {
  return {
    // State Management
    searchTerm: '',
    searchFilter: 'all',
    quickSearchActive: '',
    activeCategory: 'all',
    selectedLocation: '',
    priceRange: '',
    timeFilter: '',
    sortBy: 'newest',
    
    // Categories Configuration
    categories: [
      { id: 'all', name: 'すべて', icon: '' },
      { id: 'shopping', name: '買い物', icon: 'fas fa-shopping-cart' },
      { id: 'cleaning', name: '掃除', icon: 'fas fa-broom' },
      { id: 'delivery', name: '配送', icon: 'fas fa-truck' },
      { id: 'petcare', name: 'ペットケア', icon: 'fas fa-paw' },
      { id: 'repair', name: '修理', icon: 'fas fa-tools' },
      { id: 'others', name: 'その他', icon: 'fas fa-ellipsis-h' }
    ],
    
    // Sample Task Data (in production, this would come from server)
    sampleTasks: [
      {
        id: 1, title: '買い物代行をお願いします', category: 'shopping', location: 'shibuya', locationName: '渋谷区恵比寿',
        price: '3,000', time: '2025-08-03T10:00:00', timeDisplay: '2時間前に投稿', deadline: '明日 午前中',
        description: 'スーパーでの食材購入をお願いします。重いものもあるので車でお越しいただける方を希望します。',
        tags: ['緊急', '車必須'], status: '新規', statusClass: 'bg-green-100 text-green-700',
        icon: 'fas fa-shopping-cart', iconBg: 'bg-green-100', iconColor: 'text-green-600'
      },
      {
        id: 2, title: 'アパートの掃除をお手伝いください', category: 'cleaning', location: 'shinjuku', locationName: '新宿区西新宿',
        price: '5,000', time: '2025-08-03T07:00:00', timeDisplay: '5時間前に投稿', deadline: '今週末',
        description: '1LDKアパートの掃除をお願いします。水回りとリビングを中心にお願いできればと思います。',
        tags: ['掃除用具提供'], status: '進行中', statusClass: 'bg-yellow-100 text-yellow-700',
        icon: 'fas fa-broom', iconBg: 'bg-blue-100', iconColor: 'text-blue-600'
      },
      {
        id: 3, title: '荷物の配送をお願いします', category: 'delivery', location: 'minato', locationName: '港区六本木',
        price: '4,000', time: '2025-08-02T12:00:00', timeDisplay: '1日前に投稿', deadline: '今日 夕方',
        description: '家具の配送をお手伝いいただける方を探しています。小さなテーブルと椅子2脚です。',
        tags: ['軽トラ希望', '2名作業'], status: '新規', statusClass: 'bg-green-100 text-green-700',
        icon: 'fas fa-truck', iconBg: 'bg-orange-100', iconColor: 'text-orange-600'
      },
      {
        id: 4, title: '犬の散歩をお願いします', category: 'petcare', location: 'shibuya', locationName: '渋谷区代々木',
        price: '2,000', time: '2025-08-03T09:00:00', timeDisplay: '3時間前に投稿', deadline: '明日 朝',
        description: '小型犬の散歩をお願いします。人懐っこい子で、散歩が大好きです。30分程度でお願いします。',
        tags: ['小型犬', '人懐っこい'], status: '新規', statusClass: 'bg-green-100 text-green-700',
        icon: 'fas fa-paw', iconBg: 'bg-purple-100', iconColor: 'text-purple-600'
      },
      {
        id: 5, title: '家具の組み立てをお手伝いください', category: 'repair', location: 'chiyoda', locationName: '千代田区神田',
        price: '6,000', time: '2025-08-03T06:00:00', timeDisplay: '6時間前に投稿', deadline: '土曜日 午後',
        description: 'IKEAで購入した本棚とデスクの組み立てをお願いします。工具は揃っています。',
        tags: ['工具提供', 'IKEA家具'], status: '新規', statusClass: 'bg-green-100 text-green-700',
        icon: 'fas fa-tools', iconBg: 'bg-red-100', iconColor: 'text-red-600'
      },
      {
        id: 6, title: '薬局での買い物代行', category: 'shopping', location: 'minato', locationName: '港区赤坂',
        price: '2,500', time: '2025-08-03T08:00:00', timeDisplay: '4時間前に投稿', deadline: '今日中',
        description: '風邪薬や日用品の購入をお願いします。リストをお渡しするので、それに従って購入してください。',
        tags: ['薬局', 'リスト提供'], status: '完了', statusClass: 'bg-gray-100 text-gray-700',
        icon: 'fas fa-shopping-cart', iconBg: 'bg-green-100', iconColor: 'text-green-600'
      }
    ],
    
    // Computed Properties - Alpine.js Reactive Pattern with Sorting
    get filteredTasks() {
      const filtered = this.sampleTasks.filter(task => {
        const categoryMatch = this.activeCategory === 'all' || task.category === this.activeCategory;
        const searchMatch = this.checkSearchMatch(task);
        const quickSearchMatch = this.checkQuickSearchMatch(task);
        const locationMatch = this.selectedLocation === '' || task.location === this.selectedLocation;
        const priceMatch = this.checkPriceMatch(task);
        const timeMatch = this.checkTimeMatch(task);
        
        return categoryMatch && searchMatch && quickSearchMatch && locationMatch && priceMatch && timeMatch;
      });
      
      // Apply Sorting
      return filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'price-high':
            const priceA = parseInt(a.price.replace(/[¥,]/g, ''));
            const priceB = parseInt(b.price.replace(/[¥,]/g, ''));
            return priceB - priceA;
          case 'price-low':
            const priceA2 = parseInt(a.price.replace(/[¥,]/g, ''));
            const priceB2 = parseInt(b.price.replace(/[¥,]/g, ''));
            return priceA2 - priceB2;
          case 'distance':
            // Mock distance sorting (could be improved with actual coordinates)
            return Math.random() - 0.5;
          case 'newest':
          default:
            return new Date(b.time) - new Date(a.time);
        }
      });
    },
    
    get hasActiveFilters() {
      return this.activeCategory !== 'all' || 
             this.selectedLocation !== '' ||
             this.priceRange !== '' ||
             this.timeFilter !== '' ||
             this.sortBy !== 'newest';
    },
    
    // Lifecycle Methods
    init() {
      // Initialize relative time display
      this.updateRelativeTimes();
      setInterval(() => this.updateRelativeTimes(), 60000);
      
      // Configure Toastr
      this.configureToastr();
    },
    
    // Enhanced methods with $nextTick for better state management
    navigateToTask(taskId) {
      window.location.href = `/tasks/detail/${taskId}`;
    },
    
    applyToTask(event, taskId) {
      event.stopPropagation();
      this.$nextTick(() => {
        if (typeof toastr !== 'undefined') {
          toastr.success(`タスク ${taskId} に応募しました！`);
        }
      });
    },
    
    toggleFavorite(event, taskId) {
      event.stopPropagation();
      const heartIcon = event.target.closest('button').querySelector('i');
      this.$nextTick(() => {
        heartIcon.classList.toggle('text-gray-400');
        heartIcon.classList.toggle('text-red-400');
        const isFavorited = heartIcon.classList.contains('text-red-400');
        if (typeof toastr !== 'undefined') {
          toastr.info(isFavorited ? 'お気に入りに追加しました' : 'お気に入りから削除しました');
        }
      });
    },
    
    selectCategory(categoryId) {
      this.activeCategory = categoryId;
    },
    
    // Filter Methods - Data-based instead of DOM manipulation
    checkPriceMatch(task) {
      if (this.priceRange === '') return true;
      
      const price = parseInt(task.price.replace(/[¥,]/g, ''));
      
      switch (this.priceRange) {
        case '0-2000':
          return price <= 2000;
        case '2000-5000':
          return price >= 2000 && price <= 5000;
        case '5000-10000':
          return price >= 5000 && price <= 10000;
        case '10000+':
          return price >= 10000;
        default:
          return true;
      }
    },
    
    checkTimeMatch(task) {
      if (this.timeFilter === '') return true;
      
      const timeText = task.deadline.toLowerCase();
      
      switch (this.timeFilter) {
        case 'today':
          return timeText.includes('今日');
        case 'tomorrow':
          return timeText.includes('明日');
        case 'this-week':
          return timeText.includes('今週') || timeText.includes('週末');
        case 'flexible':
          return timeText.includes('相談') || timeText.includes('都合');
        default:
          return true;
      }
    },
    
    checkSearchMatch(task) {
      if (this.searchTerm === '') return true;
      
      const searchTerm = this.searchTerm.toLowerCase();
      
      switch (this.searchFilter) {
        case 'title':
          return task.title.toLowerCase().includes(searchTerm);
        case 'description':
          return task.description.toLowerCase().includes(searchTerm);
        case 'tags':
          return task.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        case 'location':
          return task.locationName.toLowerCase().includes(searchTerm);
        case 'all':
        default:
          const allText = `${task.title} ${task.description} ${task.locationName} ${task.tags.join(' ')}`.toLowerCase();
          return allText.includes(searchTerm);
      }
    },
    
    checkQuickSearchMatch(task) {
      if (this.quickSearchActive === '') return true;
      
      switch (this.quickSearchActive) {
        case 'urgent':
          return task.tags.some(tag => tag.includes('緊急') || tag.includes('急募'));
        case 'today':
          return task.deadline.includes('今日') || task.deadline.includes('本日');
        case 'high-pay':
          const price = parseInt(task.price.replace(/[¥,]/g, ''));
          return price >= 5000;
        default:
          return true;
      }
    },
    
    // Quick Search Methods
    quickSearch(type) {
      if (this.quickSearchActive === type) {
        this.quickSearchActive = '';
      } else {
        this.quickSearchActive = type;
      }
    },
    
    // Clear Methods
    clearSearch() {
      this.searchTerm = '';
      this.searchFilter = 'all';
      this.quickSearchActive = '';
    },
    
    clearAllFilters() {
      this.activeCategory = 'all';
      this.searchTerm = '';
      this.searchFilter = 'all';
      this.quickSearchActive = '';
      this.selectedLocation = '';
      this.priceRange = '';
      this.timeFilter = '';
      this.sortBy = 'newest';
    },
    
    // Load More Functionality
    loadMore() {
      if (typeof toastr !== 'undefined') {
        toastr.info('さらに多くの依頼を読み込んでいます...');
        setTimeout(() => {
          toastr.success('新しい依頼を読み込みました！');
        }, 1500);
      }
    },
    
    // Utility Methods
    updateRelativeTimes() {
      const timeElements = document.querySelectorAll('[data-time]');
      timeElements.forEach(element => {
        const time = element.getAttribute('data-time');
        if (time) {
          const relativeTime = this.calculateRelativeTime(time);
          element.textContent = relativeTime;
        }
      });
    },
    
    calculateRelativeTime(timeString) {
      const now = new Date();
      const time = new Date(timeString);
      const diffInMinutes = Math.floor((now - time) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'たった今';
      if (diffInMinutes < 60) return `${diffInMinutes}分前に投稿`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}時間前に投稿`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}日前に投稿`;
      
      return time.toLocaleDateString('ja-JP');
    },
    
    configureToastr() {
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
    }
  };
}

// Initialize when Alpine.js is ready
document.addEventListener('alpine:init', () => {
  console.log('TaskHelper Task List - Alpine.js initialized');
});