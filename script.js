// Expense Tracker Application
class ExpenseTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSummary();
        this.renderTransactions();
        this.setCurrentDate();
        this.initTheme();
    }

    // Event Binding
    bindEvents() {
        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Edit form submission
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditTransaction();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterTransactions();
        });

        // Filter controls
        document.getElementById('filterType').addEventListener('change', () => {
            this.filterTransactions();
        });

        document.getElementById('filterCategory').addEventListener('change', () => {
            this.filterTransactions();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Clear all transactions
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAllTransactions();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
        });
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('expense-tracker-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('expense-tracker-theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Add a subtle animation effect
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Date Management
    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    // Transaction Management
    addTransaction() {
        const formData = new FormData(document.getElementById('transactionForm'));
        const transaction = {
            id: this.generateId(),
            description: formData.get('description').trim(),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            type: formData.get('type'),
            date: formData.get('date'),
            timestamp: new Date().getTime()
        };

        // Validation
        if (!this.validateTransaction(transaction)) {
            return;
        }

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.updateSummary();
        this.renderTransactions();
        this.resetForm();
        this.showNotification('Transaction added successfully!', 'success');
    }

    validateTransaction(transaction) {
        if (!transaction.description) {
            this.showNotification('Please enter a description', 'error');
            return false;
        }
        if (!transaction.amount || transaction.amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return false;
        }
        if (!transaction.category) {
            this.showNotification('Please select a category', 'error');
            return false;
        }
        if (!transaction.type) {
            this.showNotification('Please select a type', 'error');
            return false;
        }
        if (!transaction.date) {
            this.showNotification('Please select a date', 'error');
            return false;
        }
        return true;
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        this.currentEditId = id;
        
        // Populate edit form
        document.getElementById('editDescription').value = transaction.description;
        document.getElementById('editAmount').value = transaction.amount;
        document.getElementById('editCategory').value = transaction.category;
        document.getElementById('editType').value = transaction.type;
        document.getElementById('editDate').value = transaction.date;

        this.openEditModal();
    }

    saveEditTransaction() {
        const formData = new FormData(document.getElementById('editForm'));
        const updatedTransaction = {
            description: formData.get('description').trim(),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            type: formData.get('type'),
            date: formData.get('date')
        };

        // Validation
        if (!this.validateTransaction(updatedTransaction)) {
            return;
        }

        const index = this.transactions.findIndex(t => t.id === this.currentEditId);
        if (index !== -1) {
            this.transactions[index] = { ...this.transactions[index], ...updatedTransaction };
            this.saveTransactions();
            this.updateSummary();
            this.renderTransactions();
            this.closeEditModal();
            this.showNotification('Transaction updated successfully!', 'success');
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateSummary();
            this.renderTransactions();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
    }

    clearAllTransactions() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to clear', 'info');
            return;
        }

        if (confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
            this.transactions = [];
            this.saveTransactions();
            this.updateSummary();
            this.renderTransactions();
            this.showNotification('All transactions cleared!', 'success');
        }
    }

    // Filtering and Search
    filterTransactions() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const typeFilter = document.getElementById('filterType').value;
        const categoryFilter = document.getElementById('filterCategory').value;

        let filteredTransactions = this.transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                                transaction.category.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
            const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;

            return matchesSearch && matchesType && matchesCategory;
        });

        this.renderTransactions(filteredTransactions);
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterCategory').value = 'all';
        this.renderTransactions();
    }

    // Rendering
    renderTransactions(transactionsToRender = null) {
        const transactions = transactionsToRender || this.transactions;
        const container = document.getElementById('transactionsList');
        const emptyState = document.getElementById('emptyState');

        if (transactions.length === 0) {
            container.innerHTML = '';
            container.appendChild(emptyState);
            return;
        }

        // Remove empty state if it exists
        if (emptyState.parentNode) {
            emptyState.remove();
        }

        container.innerHTML = transactions.map(transaction => this.createTransactionHTML(transaction)).join('');

        // Add event listeners to action buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editTransaction(btn.dataset.id);
            });
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTransaction(btn.dataset.id);
            });
        });
    }

    createTransactionHTML(transaction) {
        const categoryIcons = {
            food: '🍔',
            transport: '🚗',
            entertainment: '🎬',
            shopping: '🛒',
            bills: '💡',
            health: '🏥',
            education: '📚',
            salary: '💰',
            freelance: '💻',
            investment: '📈',
            other: '📦'
        };

        const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(transaction.amount));

        return `
            <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
                <div class="transaction-info">
                    <div class="transaction-icon">
                        ${categoryIcons[transaction.category] || '📦'}
                    </div>
                    <div class="transaction-details">
                        <h4>${this.escapeHtml(transaction.description)}</h4>
                        <div class="transaction-meta">
                            <span>${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</span>
                            <span>${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="transaction-amount">
                    <span class="amount-value ${transaction.type}">
                        ${transaction.type === 'expense' ? '-' : '+'}${formattedAmount}
                    </span>
                    <div class="transaction-actions">
                        <button class="action-btn edit-btn" data-id="${transaction.id}" title="Edit transaction">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${transaction.id}" title="Delete transaction">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Summary Calculations
    updateSummary() {
        const totals = this.transactions.reduce((acc, transaction) => {
            if (transaction.type === 'income') {
                acc.income += transaction.amount;
            } else {
                acc.expenses += transaction.amount;
            }
            return acc;
        }, { income: 0, expenses: 0 });

        const balance = totals.income - totals.expenses;

        // Update DOM elements with animations
        this.animateValue('totalIncome', totals.income);
        this.animateValue('totalExpenses', totals.expenses);
        this.animateValue('balance', balance);

        // Update balance card color based on positive/negative
        const balanceCard = document.querySelector('.balance-card');
        const balanceAmount = document.getElementById('balance');
        
        if (balance >= 0) {
            balanceAmount.style.color = 'var(--success-color)';
        } else {
            balanceAmount.style.color = 'var(--danger-color)';
        }
    }

    animateValue(elementId, endValue) {
        const element = document.getElementById(elementId);
        const startValue = parseFloat(element.textContent.replace(/[$,]/g, '')) || 0;
        const duration = 500;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (endValue - startValue) * easeOutQuart;
            
            element.textContent = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Modal Management
    openEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('editDescription').focus();
        }, 100);
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditId = null;
        
        // Reset form
        document.getElementById('editForm').reset();
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    resetForm() {
        document.getElementById('transactionForm').reset();
        this.setCurrentDate();
        
        // Add a subtle success animation to the form
        const form = document.querySelector('.form-section');
        form.style.transform = 'scale(1.02)';
        setTimeout(() => {
            form.style.transform = '';
        }, 200);
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            border-left: 4px solid ${this.getNotificationColor(type)};
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
            color: var(--text-primary);
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: var(--radius-sm);
            transition: all 0.2s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                this.hideNotification(notification);
            }
        }, 5000);
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--danger-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };
        return colors[type] || colors.info;
    }

    // Local Storage Management
    saveTransactions() {
        try {
            localStorage.setItem('expense-tracker-transactions', JSON.stringify(this.transactions));
        } catch (error) {
            console.error('Error saving transactions:', error);
            this.showNotification('Error saving data to local storage', 'error');
        }
    }

    loadTransactions() {
        try {
            const saved = localStorage.getItem('expense-tracker-transactions');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.showNotification('Error loading saved data', 'error');
            return [];
        }
    }

    // Export/Import Functionality (Bonus feature)
    exportData() {
        const data = {
            transactions: this.transactions,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    // Statistics (Bonus feature)
    getStatistics() {
        const stats = {
            totalTransactions: this.transactions.length,
            avgTransaction: 0,
            topCategory: '',
            monthlyTrend: {}
        };

        if (this.transactions.length > 0) {
            const totalAmount = this.transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            stats.avgTransaction = totalAmount / this.transactions.length;

            // Find top category
            const categoryCount = {};
            this.transactions.forEach(t => {
                categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
            });
            stats.topCategory = Object.keys(categoryCount).reduce((a, b) => 
                categoryCount[a] > categoryCount[b] ? a : b
            );

            // Monthly trend
            this.transactions.forEach(t => {
                const month = new Date(t.date).toISOString().substr(0, 7);
                if (!stats.monthlyTrend[month]) {
                    stats.monthlyTrend[month] = { income: 0, expenses: 0 };
                }
                if (t.type === 'income') {
                    stats.monthlyTrend[month].income += t.amount;
                } else {
                    stats.monthlyTrend[month].expenses += t.amount;
                }
            });
        }

        return stats;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ExpenseTracker();
    
    // Make app globally accessible for debugging
    window.expenseTracker = app;
    
    // Add some sample data for demonstration (only if no existing data)
    if (app.transactions.length === 0) {
        const sampleTransactions = [
            {
                id: 'sample1',
                description: 'Salary Payment',
                amount: 3500,
                category: 'salary',
                type: 'income',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now() - 86400000
            },
            {
                id: 'sample2',
                description: 'Grocery Shopping',
                amount: 85.50,
                category: 'food',
                type: 'expense',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                timestamp: Date.now() - 86400000
            },
            {
                id: 'sample3',
                description: 'Gas Station',
                amount: 45.20,
                category: 'transport',
                type: 'expense',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                timestamp: Date.now() - 172800000
            }
        ];
        
        app.transactions = sampleTransactions;
        app.saveTransactions();
        app.updateSummary();
        app.renderTransactions();
    }
});

// Service Worker Registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // This is commented out as we're not creating a service worker in this implementation
        // navigator.serviceWorker.register('/sw.js');
    });
}