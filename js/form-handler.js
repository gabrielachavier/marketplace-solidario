/* ============================================
   Marketplace Solidário - Manipulador de Formulário
   ============================================ */

/**
 * Classe para gerenciar o formulário de contato
 */
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('successMessage');
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            message: document.getElementById('message'),
            terms: document.getElementById('terms')
        };
        this.errorElements = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            message: document.getElementById('messageError'),
            terms: document.getElementById('termsError')
        };

        this.init();
    }

    /**
     * Inicializar event listeners
     */
    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Validação em tempo real
        Object.keys(this.fields).forEach(key => {
            if (this.fields[key]) {
                this.fields[key].addEventListener('blur', () => this.validateField(key));
                this.fields[key].addEventListener('input', () => this.clearError(key));
            }
        });
    }

    /**
     * Validar um campo específico
     * @param {string} fieldName - Nome do campo
     * @returns {boolean} - True se válido
     */
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];

        if (!field) return true;

        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Nome é obrigatório';
                } else if (field.value.trim().length < 3) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                }
                break;

            case 'email':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Email é obrigatório';
                } else if (!this.validateEmail(field.value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;

            case 'message':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Mensagem é obrigatória';
                } else if (field.value.trim().length < 10) {
                    isValid = false;
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                }
                break;

            case 'terms':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Você deve concordar para continuar';
                }
                break;
        }

        this.displayError(fieldName, isValid, errorMessage);
        return isValid;
    }

    /**
     * Validar email usando regex
     * @param {string} email - Email para validar
     * @returns {boolean} - True se válido
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Exibir mensagem de erro
     * @param {string} fieldName - Nome do campo
     * @param {boolean} isValid - Se o campo é válido
     * @param {string} message - Mensagem de erro
     */
    displayError(fieldName, isValid, message) {
        const errorElement = this.errorElements[fieldName];
        const fieldGroup = this.fields[fieldName]?.parentElement;

        if (!errorElement || !fieldGroup) return;

        if (isValid) {
            errorElement.classList.remove('show');
            fieldGroup.classList.remove('error');
        } else {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            fieldGroup.classList.add('error');
        }
    }

    /**
     * Limpar erro de um campo
     * @param {string} fieldName - Nome do campo
     */
    clearError(fieldName) {
        const errorElement = this.errorElements[fieldName];
        const fieldGroup = this.fields[fieldName]?.parentElement;

        if (errorElement) {
            errorElement.classList.remove('show');
        }
        if (fieldGroup) {
            fieldGroup.classList.remove('error');
        }
    }

    /**
     * Validar todo o formulário
     * @returns {boolean} - True se todos os campos são válidos
     */
    validateForm() {
        const fieldsToValidate = ['name', 'email', 'message', 'terms'];
        let isFormValid = true;

        fieldsToValidate.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    /**
     * Manipular envio do formulário
     * @param {Event} e - Evento de submit
     */
    handleSubmit(e) {
        e.preventDefault();

        // Validar formulário
        if (!this.validateForm()) {
            console.log('Formulário inválido');
            return;
        }

        // Coletar dados do formulário
        const formData = {
            name: this.fields.name.value.trim(),
            email: this.fields.email.value.trim(),
            phone: this.fields.phone.value.trim(),
            message: this.fields.message.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Simular envio
        this.submitForm(formData);
    }

    /**
     * Simular envio do formulário
     * @param {object} formData - Dados do formulário
     */
    submitForm(formData) {
        // Desabilitar botão de envio
        const submitButton = this.form.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // Simular delay de envio (1-2 segundos)
        setTimeout(() => {
            // Salvar dados no localStorage (simulação de persistência)
            this.saveFormData(formData);

            // Exibir mensagem de sucesso
            this.showSuccessMessage();

            // Resetar formulário
            this.form.reset();

            // Restaurar botão
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            // Rastrear evento
            trackEvent('form_submitted', { email: formData.email });

            // Limpar mensagem de sucesso após 5 segundos
            setTimeout(() => {
                this.hideSuccessMessage();
            }, 5000);
        }, 1500);
    }

    /**
     * Salvar dados do formulário no localStorage
     * @param {object} formData - Dados do formulário
     */
    saveFormData(formData) {
        try {
            // Recuperar dados existentes
            const existingData = localStorage.getItem('marketplaceFormSubmissions');
            const submissions = existingData ? JSON.parse(existingData) : [];

            // Adicionar novo envio
            submissions.push(formData);

            // Salvar de volta
            localStorage.setItem('marketplaceFormSubmissions', JSON.stringify(submissions));

            console.log('Dados salvos com sucesso:', formData);
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    /**
     * Exibir mensagem de sucesso
     */
    showSuccessMessage() {
        if (!this.successMessage) return;

        this.successMessage.classList.remove('hidden');
        this.successMessage.classList.add('show');

        // Rolar até a mensagem de sucesso
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Ocultar mensagem de sucesso
     */
    hideSuccessMessage() {
        if (!this.successMessage) return;

        this.successMessage.classList.remove('show');
        this.successMessage.classList.add('hidden');
    }

    /**
     * Obter dados salvos do localStorage
     * @returns {array} - Array com todos os envios
     */
    getSavedData() {
        try {
            const data = localStorage.getItem('marketplaceFormSubmissions');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao recuperar dados:', error);
            return [];
        }
    }

    /**
     * Limpar dados salvos
     */
    clearSavedData() {
        try {
            localStorage.removeItem('marketplaceFormSubmissions');
            console.log('Dados limpos com sucesso');
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
        }
    }
}

/**
 * Inicializar o manipulador de formulário quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    const formHandler = new ContactFormHandler();

    // Disponibilizar globalmente para debug
    window.contactFormHandler = formHandler;

    console.log('Manipulador de Formulário Inicializado');
});

