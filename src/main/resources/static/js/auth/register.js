// Register Page JavaScript
// Alpine.js registerForm component is now loaded from common-scripts.html

// Configure Toastr
toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "timeOut": "4000"
};

// ========================================
// Joi Validation Schema
// ========================================
const registerSchema = typeof Joi !== 'undefined' ? Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'お名前は2文字以上で入力してください。',
    'string.max': 'お名前は50文字以下で入力してください。',
    'any.required': 'お名前を入力してください。'
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': '有効なメールアドレスを入力してください。',
    'any.required': 'メールアドレスを入力してください。'
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/).required().messages({
    'string.min': 'パスワードは8文字以上で入力してください。',
    'string.pattern.base': 'パスワードには英数字と記号を含めてください。',
    'any.required': 'パスワードを入力してください。'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'パスワードが一致しません。',
    'any.required': 'パスワード確認を入力してください。'
  }),
  terms: Joi.array().min(2).required().messages({
    'array.min': '必須利用規約に同意してください。',
    'any.required': '必須利用規約に同意してください。'
  })
}) : null;

// Enhanced validation function using Joi
function validateWithJoi(data) {
  if (!registerSchema) {
    // Joi library not available
    return { error: null };
  }
  
  return registerSchema.validate(data, { abortEarly: false });
}

// ========================================
// Modal Confirm Button Handlers
// ========================================
function handleModalConfirm(termType) {
  // Map term type to checkbox ID and modal ID
  const termConfig = {
    'service': { checkboxId: 'service-terms', modalId: 'modal-service-terms' },
    'privacy': { checkboxId: 'privacy-terms', modalId: 'modal-privacy-policy' },
    'marketing': { checkboxId: 'marketing-terms', modalId: 'modal-marketing-terms' }
  };
  
  const config = termConfig[termType];
  if (!config) {
    return;
  }
  
  const checkbox = document.getElementById(config.checkboxId);
  
  if (checkbox) {
    // Check the checkbox
    checkbox.checked = true;
    // Trigger change event to update Alpine.js state
    checkbox.dispatchEvent(new Event('change'));
    
    // Close the modal manually using MicroModal
    if (typeof MicroModal !== 'undefined') {
      MicroModal.close(config.modalId);
    }
  }
}

// MicroModal handled by common-scripts
document.addEventListener('DOMContentLoaded', function() {
  // Register - Using MicroModal from common-scripts

  // ========================================
  // Modal Button Event Listeners
  // ========================================
  
  // Terms confirmation buttons
  const serviceConfirmBtn = document.getElementById('service-terms-confirm');
  const privacyConfirmBtn = document.getElementById('privacy-policy-confirm');  
  const marketingConfirmBtn = document.getElementById('marketing-terms-confirm');
  
  if (serviceConfirmBtn) {
    serviceConfirmBtn.addEventListener('click', () => handleModalConfirm('service'));
  }
  
  if (privacyConfirmBtn) {
    privacyConfirmBtn.addEventListener('click', () => handleModalConfirm('privacy'));
  }
  
  if (marketingConfirmBtn) {
    marketingConfirmBtn.addEventListener('click', () => handleModalConfirm('marketing'));
  }
  
  // Apple button explicit handler to fix modal trigger issue
  const appleButton = document.getElementById('apple-social-trigger');
  if (appleButton) {
    appleButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (typeof MicroModal !== 'undefined') {
        MicroModal.show('modal-social-apple');
      }
    });
  }
});