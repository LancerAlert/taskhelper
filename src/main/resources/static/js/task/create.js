// Alpine.js Task Creation Form Component
// Replaces 340+ lines of vanilla JavaScript with reactive Alpine.js

// Register component when Alpine.js initializes
document.addEventListener('alpine:init', () => {
  console.log('Registering createTaskForm component');
  
  // Make function globally available for Alpine.js
  window.createTaskForm = function createTaskForm() {
    return {
      // Form data
      form: {
        category: '',
        title: '',
        description: '',
        location: '',
        budget: '',
        preferred_date: '',
        preferred_time: '',
        urgent: false,
        photo_required: false,
        contact_phone: false,
        images: []
      },

      // UI state
      isSubmitting: false,

      // Validation errors
      errors: {
        category: '',
        title: '',
        description: '',
        location: '',
        budget: '',
        preferred_date: '',
        preferred_time: '',
        images: ''
      },

      // Validation status
      isValid: {
        category: false,
        title: false,
        description: false,
        location: false,
        budget: false,
        preferred_date: false,
        preferred_time: false
      },

      // Today's date for minimum date restriction
      get today() {
        return new Date().toISOString().split('T')[0];
      },

      // Overall form validity
      get isFormValid() {
        return this.isValid.category && 
               this.isValid.title && 
               this.isValid.description && 
               this.isValid.location && 
               this.isValid.budget && 
               this.isValid.preferred_date && 
               this.isValid.preferred_time;
               // Note: images are optional, so not included in form validity
      },

      // Initialize form
      initForm() {
        console.log('Alpine.js create task form initialized');
        // No additional initialization needed for this form
      },

      // Validate individual field
      validateField(fieldName) {
        console.log(`Validating field: ${fieldName}`);
        
        switch (fieldName) {
          case 'category':
            return this.validateCategory();
          case 'title':
            return this.validateTitle();
          case 'description':
            return this.validateDescription();
          case 'location':
            return this.validateLocation();
          case 'budget':
            return this.validateBudget();
          case 'preferred_date':
            return this.validateDate();
          case 'preferred_time':
            return this.validateTime();
          default:
            return true;
        }
      },

      // Category validation
      validateCategory() {
        if (!this.form.category) {
          this.errors.category = 'カテゴリを選択してください。';
          this.isValid.category = false;
        } else {
          this.errors.category = '';
          this.isValid.category = true;
        }
        return this.isValid.category;
      },

      // Title validation
      validateTitle() {
        const title = this.form.title.trim();
        if (!title) {
          this.errors.title = 'タイトルを入力してください。';
          this.isValid.title = false;
        } else if (title.length < 5) {
          this.errors.title = 'タイトルは5文字以上で入力してください。';
          this.isValid.title = false;
        } else {
          this.errors.title = '';
          this.isValid.title = true;
        }
        return this.isValid.title;
      },

      // Description validation
      validateDescription() {
        const description = this.form.description.trim();
        if (!description) {
          this.errors.description = '詳細説明を入力してください。';
          this.isValid.description = false;
        } else if (description.length < 15) {
          this.errors.description = '詳細説明は15文字以上で入力してください。';
          this.isValid.description = false;
        } else {
          this.errors.description = '';
          this.isValid.description = true;
        }
        return this.isValid.description;
      },

      // Location validation
      validateLocation() {
        const location = this.form.location.trim();
        if (!location) {
          this.errors.location = '実施場所を入力してください。';
          this.isValid.location = false;
        } else {
          this.errors.location = '';
          this.isValid.location = true;
        }
        return this.isValid.location;
      },

      // Budget validation
      validateBudget() {
        const budget = parseInt(this.form.budget);
        if (!this.form.budget) {
          this.errors.budget = '予算を入力してください。';
          this.isValid.budget = false;
        } else if (budget < 500) {
          this.errors.budget = '予算は500円以上で設定してください。';
          this.isValid.budget = false;
        } else if (budget > 50000) {
          this.errors.budget = '予算は50,000円以下で設定してください。';
          this.isValid.budget = false;
        } else {
          this.errors.budget = '';
          this.isValid.budget = true;
        }
        return this.isValid.budget;
      },

      // Date validation
      validateDate() {
        if (!this.form.preferred_date) {
          this.errors.preferred_date = '希望日を選択してください。';
          this.isValid.preferred_date = false;
        } else {
          const selectedDate = new Date(this.form.preferred_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            this.errors.preferred_date = '本日以降の日付を選択してください。';
            this.isValid.preferred_date = false;
          } else {
            this.errors.preferred_date = '';
            this.isValid.preferred_date = true;
          }
        }
        return this.isValid.preferred_date;
      },

      // Time validation
      validateTime() {
        if (!this.form.preferred_time) {
          this.errors.preferred_time = '希望時間を選択してください。';
          this.isValid.preferred_time = false;
        } else {
          this.errors.preferred_time = '';
          this.isValid.preferred_time = true;
        }
        return this.isValid.preferred_time;
      },

      // Validate entire form
      validateForm() {
        const isCategoryValid = this.validateCategory();
        const isTitleValid = this.validateTitle();
        const isDescriptionValid = this.validateDescription();
        const isLocationValid = this.validateLocation();
        const isBudgetValid = this.validateBudget();
        const isDateValid = this.validateDate();
        const isTimeValid = this.validateTime();

        return isCategoryValid && isTitleValid && isDescriptionValid && 
               isLocationValid && isBudgetValid && isDateValid && isTimeValid;
      },

      // Preview form
      previewForm() {
        if (!this.validateForm()) {
          toastr.error('入力内容を確認してください。', '入力エラー');
          return;
        }

        const categoryNames = {
          'shopping': '買い物',
          'cleaning': '掃除',
          'delivery': '配送',
          'petcare': 'ペットケア',
          'repair': '修理',
          'others': 'その他'
        };

        const timeNames = {
          'morning': '午前中 (9:00-12:00)',
          'afternoon': '午後 (13:00-17:00)',
          'evening': '夕方 (17:00-20:00)',
          'anytime': 'いつでも'
        };

        let previewText = `【${categoryNames[this.form.category]}】${this.form.title}\n\n`;
        previewText += `${this.form.description}\n\n`;
        previewText += `場所: ${this.form.location}\n`;
        previewText += `予算: ¥${parseInt(this.form.budget).toLocaleString()}\n`;
        previewText += `希望日: ${this.form.preferred_date}\n`;
        previewText += `希望時間: ${timeNames[this.form.preferred_time]}\n`;
        if (this.form.urgent) previewText += `\n緊急依頼`;
        if (this.form.images.length > 0) previewText += `\n添付画像: ${this.form.images.length}枚`;
        
        alert(previewText);
      },

      // Cancel form
      cancelForm() {
        if (confirm('入力内容が破棄されます。よろしいですか？')) {
          window.history.back();
        }
      },

      // Handle image upload
      handleImageUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (this.form.images.length + files.length > 4) {
          this.errors.images = '画像は最大4枚までアップロードできます。';
          return;
        }

        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            this.errors.images = '画像ファイルのみアップロードできます。';
            continue;
          }

          // Validate file size (10MB)
          if (file.size > 10 * 1024 * 1024) {
            this.errors.images = 'ファイルサイズは10MB以下にしてください。';
            continue;
          }

          // Create preview
          const reader = new FileReader();
          reader.onload = (e) => {
            this.form.images.push({
              file: file,
              preview: e.target.result,
              name: file.name
            });
            
            // Clear any previous error
            if (this.errors.images && this.form.images.length <= 4) {
              this.errors.images = '';
            }
          };
          reader.readAsDataURL(file);
        }

        // Clear the input so the same file can be selected again
        event.target.value = '';
      },

      // Remove image
      removeImage(index) {
        this.form.images.splice(index, 1);
        
        // Clear error if under limit
        if (this.form.images.length < 4 && this.errors.images) {
          this.errors.images = '';
        }
      },

      // Preview image in modal
      previewImage(imageSrc) {
        // Simple image preview - can be enhanced with MicroModal later
        window.open(imageSrc, '_blank');
      },

      // Form submission
      async submitForm() {
        console.log('Task creation form submission started');
        
        if (!this.validateForm()) {
          toastr.error('入力内容を確認してください。', '入力エラー');
          return;
        }
        
        this.isSubmitting = true;
        
        try {
          // Simulate task creation process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Show success message
          toastr.success('代行依頼が正常に投稿されました。ヘルパーからの応募をお待ちください。', '投稿完了！');
          
          // Redirect after success
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
          
        } catch (error) {
          console.error('Task creation failed:', error);
          toastr.error('投稿中にエラーが発生しました。もう一度お試しください。', 'エラー');
        } finally {
          this.isSubmitting = false;
        }
      }
    };
  }; // End of createTaskForm function
}); // End of alpine:init event listener

console.log('Alpine.js create task form component loaded');