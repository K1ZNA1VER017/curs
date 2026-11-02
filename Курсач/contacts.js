// contacts.js - обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            
            // Валидация
            if (!validateForm(formData)) {
                return;
            }
            
            // Анимация отправки
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Имитация отправки (в реальном проекте здесь будет AJAX запрос)
            setTimeout(() => {
                // Сброс формы
                feedbackForm.reset();
                
                // Возврат исходного текста кнопки
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Показать сообщение об успехе
                showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Логирование данных (в реальном проекте здесь будет отправка на сервер)
                console.log('Данные формы:', formData);
                
            }, 2000);
        });
    }
    
    // Валидация формы
    function validateForm(data) {
        if (!data.name.trim()) {
            showNotification('Пожалуйста, введите ваше имя', 'error');
            document.getElementById('name').focus();
            return false;
        }
        
        if (!data.email.trim()) {
            showNotification('Пожалуйста, введите email', 'error');
            document.getElementById('email').focus();
            return false;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            document.getElementById('email').focus();
            return false;
        }
        
        if (!data.message.trim()) {
            showNotification('Пожалуйста, введите сообщение', 'error');
            document.getElementById('message').focus();
            return false;
        }
        
        if (!document.getElementById('agreement').checked) {
            showNotification('Необходимо согласие на обработку персональных данных', 'error');
            return false;
        }
        
        return true;
    }
    
    // Проверка email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Показать уведомление
    function showNotification(message, type) {
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Стили уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
        }
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                let formattedValue = '+7 (';
                
                if (value.length > 0) {
                    formattedValue += value.substring(0, 3);
                }
                if (value.length > 3) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formattedValue += '-' + value.substring(8, 10);
                }
                
                e.target.value = formattedValue;
            }
        });
    }
});