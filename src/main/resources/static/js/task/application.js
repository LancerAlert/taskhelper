/**
 * Task Application Manager
 * 応募者管理画面のAlpine.jsコンポーネント
 */

function applicantsManager() {
  return {
    // Task data
    task: {
      id: 1,
      title: '近所のスーパーで買い物代行',
      category: 'shopping',
      description: '近所のスーパーマーケットで食料品と日用品の買い物をお願いします。',
      date: '2025年1月15日',
      timeSlot: '午後 (13:00-17:00)',
      location: '渋谷区神南',
      price: 2500,
      status: 'recruiting'
    },
    
    // Applicants data
    applicants: [
      {
        id: 1,
        name: '田中 太郎',
        profileImage: '/images/profiles/helper1.jpg',
        rating: 4.8,
        reviewCount: 127,
        completedTasks: 243,
        distance: '1.2km',
        appliedAt: '2025-01-10T14:30:00',
        isOnline: true,
        isVerified: true,
        message: 'こんにちは！お買い物代行の経験が豊富です。重い荷物も問題なく運べますし、商品の選定にも自信があります。ご希望の商品をしっかりと購入し、丁寧に配送いたします。よろしくお願いします！',
        specialties: ['買い物', '配送', '掃除'],
        completionRate: 95
      },
      {
        id: 2,
        name: '佐藤 花子',
        profileImage: '/images/profiles/helper2.jpg',
        rating: 4.6,
        reviewCount: 89,
        completedTasks: 156,
        distance: '0.8km',
        appliedAt: '2025-01-10T15:45:00',
        isOnline: false,
        isVerified: true,
        message: '近所に住んでいるので、すぐに対応可能です。食材の鮮度にもこだわって選びます。',
        specialties: ['買い物', 'ペットケア'],
        completionRate: 92
      },
      {
        id: 3,
        name: '鈴木 一郎',
        profileImage: '/images/profiles/helper3.jpg',
        rating: 4.9,
        reviewCount: 201,
        completedTasks: 412,
        distance: '2.5km',
        appliedAt: '2025-01-10T16:20:00',
        isOnline: true,
        isVerified: false,
        message: '多くの買い物代行を経験してきました。効率的に買い物を済ませ、時間通りにお届けします。',
        specialties: ['買い物', '配送', '修理'],
        completionRate: 98
      }
    ],

    // Filter and sort state
    sortBy: 'rating', // rating, experience, distance, applied

    // Get sorted applicants
    getSortedApplicants() {
      const sorted = [...this.applicants];
      
      switch(this.sortBy) {
        case 'rating':
          return sorted.sort((a, b) => b.rating - a.rating);
        case 'experience':
          return sorted.sort((a, b) => b.completedTasks - a.completedTasks);
        case 'distance':
          return sorted.sort((a, b) => {
            const distA = parseFloat(a.distance.replace('km', ''));
            const distB = parseFloat(b.distance.replace('km', ''));
            return distA - distB;
          });
        case 'applied':
          return sorted.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
        default:
          return sorted;
      }
    },

    // Select helper
    async selectHelper(applicant) {
      const confirmed = await Swal.fire({
        title: 'ヘルパーを選択',
        html: `
          <div class="text-left">
            <p class="mb-2"><strong>${applicant.name}</strong>さんを選択してよろしいですか？</p>
            <p class="text-sm text-gray-600">選択後、他の応募者には自動で通知されます。</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '選択する',
        cancelButtonText: 'キャンセル'
      });

      if (confirmed.isConfirmed) {
        try {
          // In production, send request to server
          // await fetch(`/api/tasks/${this.task.id}/select-helper`, {
          //     method: 'POST',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify({ helperId: applicant.id })
          // });

          await Swal.fire({
            title: '選択完了',
            text: `${applicant.name}さんを選択しました。`,
            icon: 'success',
            confirmButtonColor: '#2563eb'
          });

          // Redirect to task detail or my tasks
          window.location.href = '/tasks/my';
        } catch (error) {
          toastr.error('選択に失敗しました。もう一度お試しください。');
        }
      }
    },

    // View profile
    viewProfile(applicantId) {
      // Navigate to profile page
      window.location.href = `/user/profile-public?userId=${applicantId}`;
    },

    // Send message
    async sendMessage(applicantId) {
      const { value: message } = await Swal.fire({
        title: 'メッセージを送信',
        input: 'textarea',
        inputPlaceholder: 'メッセージを入力してください...',
        inputAttributes: {
          'aria-label': 'メッセージを入力'
        },
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '送信',
        cancelButtonText: 'キャンセル'
      });

      if (message) {
        try {
          // In production, send message via API
          // await fetch('/api/messages', { ... });
          
          toastr.success('メッセージを送信しました');
        } catch (error) {
          toastr.error('メッセージの送信に失敗しました');
        }
      }
    },

    // Get average rating
    get averageRating() {
      if (this.applicants.length === 0) return 0;
      const sum = this.applicants.reduce((acc, a) => acc + a.rating, 0);
      return sum / this.applicants.length;
    },

    // Get average completion rate
    get averageCompletionRate() {
      if (this.applicants.length === 0) return 0;
      const sum = this.applicants.reduce((acc, a) => acc + a.completionRate, 0);
      return Math.round(sum / this.applicants.length);
    },

    // Get relative time
    getRelativeTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'たった今';
      if (diffMins < 60) return `${diffMins}分前`;
      if (diffHours < 24) return `${diffHours}時間前`;
      if (diffDays < 7) return `${diffDays}日前`;
      
      return date.toLocaleDateString('ja-JP');
    },

    // Format price
    formatPrice(price) {
      return '¥' + price.toLocaleString('ja-JP');
    },

    // Get category icon
    getCategoryIcon(category) {
      const icons = {
        shopping: 'fas fa-shopping-cart',
        cleaning: 'fas fa-broom',
        delivery: 'fas fa-truck',
        petcare: 'fas fa-paw',
        repair: 'fas fa-tools',
        others: 'fas fa-ellipsis-h'
      };
      return icons[category] || icons.others;
    },

    // Get category color class
    getCategoryColorClass(category) {
      const colors = {
        shopping: 'from-green-500 to-green-600',
        cleaning: 'from-blue-500 to-blue-600',
        delivery: 'from-orange-500 to-orange-600',
        petcare: 'from-purple-500 to-purple-600',
        repair: 'from-red-500 to-red-600',
        others: 'from-gray-500 to-gray-600'
      };
      return 'bg-gradient-to-br ' + (colors[category] || colors.others);
    },

    // Get category badge class
    getCategoryBadgeClass(specialty) {
      const categoryMap = {
        '買い物': 'bg-green-100 text-green-800',
        '掃除': 'bg-blue-100 text-blue-800',
        '配送': 'bg-orange-100 text-orange-800',
        'ペットケア': 'bg-purple-100 text-purple-800',
        '修理': 'bg-red-100 text-red-800',
        'その他': 'bg-gray-100 text-gray-800'
      };
      return categoryMap[specialty] || 'bg-gray-100 text-gray-800';
    }
  };
}
