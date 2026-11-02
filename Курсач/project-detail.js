document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модального окна
    initModal();
    
    // Инициализация формы заявки
    initApplyForm();
    
    // Загрузка похожих проектов
    loadSimilarProjects();
});

function initModal() {
    const modal = document.getElementById('applyModal');
    const applyButtons = document.querySelectorAll('.open-apply-modal');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    
    // Открытие модального окна
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закрытие модального окна
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function initApplyForm() {
    const applyForm = document.getElementById('projectApplyForm');
    
    if (applyForm) {
        applyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            if (validateForm()) {
                submitApplication();
            }
        });
    }
    
    // Валидация в реальном времени
    const inputs = applyForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    const form = document.getElementById('projectApplyForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    const emailField = document.getElementById('applicantEmail');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Введите корректный email адрес');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Это поле обязательно для заполнения');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Введите корректный email адрес');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitApplication() {
    const form = document.getElementById('projectApplyForm');
    const formData = new FormData(form);
    
    // Создаем объект с данными формы
    const applicationData = {
        project: document.querySelector('h1').textContent,
        name: formData.get('applicantName'),
        email: formData.get('applicantEmail'),
        phone: formData.get('applicantPhone'),
        experience: formData.get('applicantExperience'),
        message: formData.get('applicantMessage'),
        portfolio: formData.get('applicantPortfolio'),
        timestamp: new Date().toISOString()
    };
    
    // В реальном приложении здесь был бы AJAX запрос к серверу
    console.log('Заявка отправлена:', applicationData);
    
    // Показываем сообщение об успехе
    showSuccessMessage();
    
    // Закрываем модальное окно
    document.getElementById('applyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    form.reset();
}

function showSuccessMessage() {
    // Создаем элемент для сообщения об успехе
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3>Заявка отправлена!</h3>
            <p>Мы свяжемся с вами в ближайшее время для обсуждения деталей проекта.</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Понятно</button>
        </div>
    `;
    
    // Стили для сообщения об успехе
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1001;
        text-align: center;
        animation: modalSlideIn 0.3s ease-out;
    `;
    
    const successContent = successMessage.querySelector('.success-content');
    successContent.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    `;
    
    const successIcon = successMessage.querySelector('.success-icon');
    successIcon.style.cssText = `
        width: 60px;
        height: 60px;
        background: #4CAF50;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
    `;
    
    document.body.appendChild(successMessage);
    
    // Автоматически удаляем сообщение через 5 секунд
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
}

function loadSimilarProjects() {
    const similarContainer = document.getElementById('similarProjects');
    
    if (!similarContainer) return;
    
    // В реальном приложении здесь был бы запрос к API
    const similarProjects = [
        {
            title: 'Доработка отчетов в 1С',
            category: '1С разработка',
            budget: '80 000 руб.',
            deadline: '7 дней',
            link: 'project-1c-reports.html'
        },
        {
            title: 'Оптимизация базы данных',
            category: 'Базы данных',
            budget: '120 000 руб.',
            deadline: '10 дней',
            link: 'project-database-optimization.html'
        }
    ];
    
    similarProjects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card-mini';
        projectElement.innerHTML = `
            <div class="project-card-mini-content">
                <h4>${project.title}</h4>
                <div class="project-meta-mini">
                    <span class="project-category-mini">${project.category}</span>
                    <span class="project-budget-mini">${project.budget}</span>
                </div>
                <div class="project-deadline-mini">${project.deadline}</div>
                <a href="${project.link}" class="btn btn-outline btn-small">Подробнее</a>
            </div>
        `;
        
        similarContainer.appendChild(projectElement);
    });
}

// Добавляем стили для мини-карточек проектов
const miniCardStyles = `
    .project-card-mini {
        background: var(--background-white);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .project-card-mini:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .project-card-mini-content h4 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        color: var(--text-dark);
    }
    
    .project-meta-mini {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .project-category-mini {
        color: var(--text-light);
    }
    
    .project-budget-mini {
        color: var(--primary-orange);
        font-weight: 600;
    }
    
    .project-deadline-mini {
        color: var(--text-light);
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }
    
    .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = miniCardStyles;
document.head.appendChild(styleSheet);