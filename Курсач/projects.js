document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Сохраняем оригинальные данные проектов
    const projectsData = Array.from(projectCards).map(card => {
        return {
            element: card,
            category: card.querySelector('.project-category').textContent.toLowerCase(),
            complexity: card.querySelector('.project-complexity').textContent.toLowerCase(),
            budget: getBudgetRange(card.querySelector('.project-budget').textContent)
        };
    });

    // Добавляем обработчики на изменение селектов
    document.getElementById('category').addEventListener('change', filterProjects);
    document.getElementById('complexity').addEventListener('change', filterProjects);
    document.getElementById('budget').addEventListener('change', filterProjects);

    function filterProjects() {
        const category = document.getElementById('category').value;
        const complexity = document.getElementById('complexity').value;
        const budget = document.getElementById('budget').value;
        
        let visibleCount = 0;

        projectsData.forEach(project => {
            const categoryMatch = !category || project.category.includes(getCategoryValue(category));
            const complexityMatch = !complexity || project.complexity.includes(getComplexityValue(complexity));
            const budgetMatch = !budget || checkBudgetMatch(project.budget, budget);

            if (categoryMatch && complexityMatch && budgetMatch) {
                project.element.style.display = 'block';
                visibleCount++;
                // Анимация появления
                setTimeout(() => {
                    project.element.style.opacity = '1';
                    project.element.style.transform = 'translateY(0)';
                }, 50);
            } else {
                project.element.style.opacity = '0';
                project.element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    project.element.style.display = 'none';
                }, 300);
            }
        });

        // Показываем сообщение, если нет проектов
        showNoProjectsMessage(visibleCount === 0);
    }

    function getBudgetRange(budgetText) {
        const budget = budgetText.replace(/[^\d]/g, '');
        const amount = parseInt(budget);
        
        if (amount <= 50000) return 'low';
        if (amount <= 200000) return 'medium';
        return 'high';
    }

    function getCategoryValue(category) {
        const categoryMap = {
            '1c': '1с',
            'web': 'веб',
            'mobile': 'мобильные',
            'analytics': 'аналитика'
        };
        return categoryMap[category] || category;
    }

    function getComplexityValue(complexity) {
        const complexityMap = {
            'low': 'низкая',
            'medium': 'средняя',
            'high': 'высокая'
        };
        return complexityMap[complexity] || complexity;
    }

    function checkBudgetMatch(projectBudget, selectedBudget) {
        return projectBudget === selectedBudget;
    }

    function showNoProjectsMessage(show) {
        let message = document.querySelector('.no-projects-message');
        
        if (show && !message) {
            message = document.createElement('div');
            message.className = 'no-projects-message';
            message.innerHTML = `
                <div class="no-projects-content">
                    <div class="no-projects-icon">🔍</div>
                    <h3>Проекты не найдены</h3>
                    <p>Попробуйте изменить параметры фильтров</p>
                    <button class="btn btn-primary" onclick="resetFilters()">Сбросить фильтры</button>
                </div>
            `;
            document.querySelector('.projects-grid').appendChild(message);
            
            // Анимация появления
            setTimeout(() => {
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, 50);
        } else if (!show && message) {
            message.style.opacity = '0';
            message.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }
    }

    // Обработчики для кнопок "Подать заявку" - теперь ведут на отдельные страницы
    const applyButtons = document.querySelectorAll('.btn-outline');
    applyButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
            
            // Определяем, на какую страницу переходить
            const projectPages = [
                'project-1c-integration.html',
                'project-mobile-app.html',
                'project-1c-reports.html',
                'project-database-optimization.html',
                'project-analytics-dashboard.html',
                'project-data-migration.html'
            ];
            
            if (projectPages[index]) {
                window.location.href = projectPages[index];
            } else {
                // Анимация нажатия для проектов без отдельной страницы
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    alert(`Заявка на проект: "${projectTitle}"\n\nФункция подачи заявки будет реализована в полной версии платформы`);
                }, 150);
            }
        });
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Функция сброса фильтров (глобальная для использования в onclick)
function resetFilters() {
    document.getElementById('category').value = '';
    document.getElementById('complexity').value = '';
    document.getElementById('budget').value = '';
    
    // Запускаем фильтрацию
    const event = new Event('change');
    document.getElementById('category').dispatchEvent(event);
}