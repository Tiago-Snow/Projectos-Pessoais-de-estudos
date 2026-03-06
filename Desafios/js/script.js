// ======================================
// GERENCIAMENTO DE TEMA (DARK MODE)
// ======================================

const btnTema = document.getElementById('btnTema');
const html = document.documentElement;

// Verificar preferência salva ou preferência do sistema
function iniciarTema() {
    const temaSalvo = localStorage.getItem('tema');
    const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (temaSalvo === 'dark' || (!temaSalvo && prefereDark)) {
        document.body.classList.add('dark-theme');
        btnTema.textContent = '☀️';
    } else {
        btnTema.textContent = '🌙';
    }
}

btnTema.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('tema', 'dark');
        btnTema.textContent = '☀️';
    } else {
        localStorage.setItem('tema', 'light');
        btnTema.textContent = '🌙';
    }
});

// ======================================
// MENU MOBILE RESPONSIVO
// ======================================

const btnMenu = document.getElementById('btnMenu');
const nav = document.getElementById('navegacao');
const navLinks = nav.querySelectorAll('.nav-link');

btnMenu.addEventListener('click', function() {
    nav.classList.toggle('nav-aberta');
    btnMenu.classList.toggle('ativo');
    btnMenu.setAttribute('aria-expanded', nav.classList.contains('nav-aberta'));
});

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        nav.classList.remove('nav-aberta');
        btnMenu.classList.remove('ativo');
        btnMenu.setAttribute('aria-expanded', false);
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('nav') && !e.target.closest('.btn-menu')) {
        nav.classList.remove('nav-aberta');
        btnMenu.classList.remove('ativo');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    iniciarTema();
    inicializarFormulario();
    inicializarFAQ();
    inicializarToggleSenha();
    recuperarRascunhoFormulario();
});

// ======================================
// FORMULÁRIO DE CADASTRO INTERATIVO
// ======================================

function inicializarFormulario() {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"]');
    const btnEnviar = form.querySelector('.btn-enviar');
    const btnLimpar = form.querySelector('.btn-limpar');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
            salvarRascunhoFormulario();
        });

        input.addEventListener('focus', function() {
            removerMensagemErro(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('erro')) {
                validarCampo(this);
            }
            salvarRascunhoFormulario();
        });
    });

    // VALIDAR CAMPO ESPECÍFICO
    function validarCampo(campo) {
        const tipo = campo.type;
        const valor = campo.value.trim();
        let valido = true;
        let mensagem = '';

        if (!valor) {
            valido = false;
            mensagem = 'Este campo é obrigatório';
        } else {
            switch (tipo) {
                case 'text':
                    if (campo.id === 'nome') {
                        if (valor.length < 3) {
                            valido = false;
                            mensagem = 'Nome deve ter pelo menos 3 caracteres';
                        } else if (!/^[a-záàâãéèêíïóôõöúçñ\s]+$/i.test(valor)) {
                            valido = false;
                            mensagem = 'Nome não pode conter números ou caracteres especiais';
                        }
                    }
                    break;

                case 'email':
                    if (!validarEmail(valor)) {
                        valido = false;
                        mensagem = 'Email inválido. Use o formato: seu@email.com';
                    }
                    break;

                case 'password':
                    if (campo.id === 'senha') {
                        const validacaoSenha = validarSenha(valor);
                        if (!validacaoSenha.valida) {
                            valido = false;
                            mensagem = validacaoSenha.mensagem;
                        }
                    } else if (campo.id === 'confirmaSenha') {
                        const senha = document.getElementById('senha').value;
                        if (valor !== senha) {
                            valido = false;
                            mensagem = 'As senhas não correspondem';
                        }
                    }
                    break;

                case 'tel':
                    if (valor && !validarTelefone(valor)) {
                        valido = false;
                        mensagem = 'Telefone inválido. Use o formato: (11) 98765-4321';
                    }
                    break;
            }
        }

        if (valido) {
            campo.classList.remove('erro');
            campo.classList.add('sucesso');
            removerMensagemErro(campo);
        } else {
            campo.classList.remove('sucesso');
            campo.classList.add('erro');
            exibirMensagemErro(campo, mensagem);
        }

        return valido;
    }

    // VALIDAR EMAIL
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // VALIDAR SENHA
    function validarSenha(senha) {
        if (senha.length < 8) {
            return {
                valida: false,
                mensagem: 'Senha deve ter no mínimo 8 caracteres'
            };
        }

        const temMaiuscula = /[A-Z]/.test(senha);
        const temMinuscula = /[a-z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);

        if (!temMaiuscula || !temMinuscula || !temNumero) {
            return {
                valida: false,
                mensagem: 'Senha deve conter maiúscula, minúscula e números'
            };
        }

        return { valida: true, mensagem: '' };
    }

    // VALIDAR TELEFONE
    function validarTelefone(telefone) {
        const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return regex.test(telefone);
    }

    // EXIBIR MENSAGEM DE ERRO
    function exibirMensagemErro(campo, mensagem) {
        let msgElement = campo.nextElementSibling;
        
        if (!msgElement || !msgElement.classList.contains('mensagem-erro')) {
            msgElement = document.createElement('span');
            msgElement.classList.add('mensagem-erro');
            campo.parentNode.insertBefore(msgElement, campo.nextSibling);
        }

        msgElement.textContent = '⚠️ ' + mensagem;
        msgElement.style.display = 'block';
    }

    // REMOVER MENSAGEM DE ERRO
    function removerMensagemErro(campo) {
        const msgElement = campo.nextElementSibling;
        if (msgElement && msgElement.classList.contains('mensagem-erro')) {
            msgElement.style.display = 'none';
        }
    }

    // ENVIO DO FORMULÁRIO
    btnEnviar.addEventListener('click', function(e) {
        e.preventDefault();

        let todosValidos = true;

        inputs.forEach(input => {
            if (!validarCampo(input)) {
                todosValidos = false;
            }
        });

        const termos = document.getElementById('termos');
        if (!termos.checked) {
            todosValidos = false;
            exibirMensagemErro(termos, 'Você deve concordar com os termos');
        }

        if (todosValidos) {
            mostrarMensagemSucesso();
            form.reset();
            inputs.forEach(input => {
                input.classList.remove('sucesso', 'erro');
            });
        } else {
            mostrarMensagemErroGeral();
        }
    });

// LIMPAR FORMULÁRIO
btnLimpar.addEventListener('click', function() {
    form.reset();
    inputs.forEach(input => {
        input.classList.remove('sucesso', 'erro');
        removerMensagemErro(input);
    });
    document.getElementById('termos').classList.remove('erro');
    localStorage.removeItem('rascunhoFormulario');
    mostrarToast('Formulário limpo com sucesso!', 'info');
});

// MENSAGEM DE SUCESSO
function mostrarMensagemSucesso() {
        const modal = document.getElementById('modalSucesso');
        const btnFechar = modal.querySelector('.modal-fechar');
        const btnEntendido = modal.querySelector('.btn-enviar');

        modal.removeAttribute('hidden');

        function fecharModal() {
            modal.setAttribute('hidden', '');
            localStorage.removeItem('rascunhoFormulario');
            form.reset();
        }

        btnFechar.addEventListener('click', fecharModal);
        btnEntendido.addEventListener('click', fecharModal);

        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal();
            }
        });

        mostrarToast('✅ Cadastro realizado com sucesso!', 'sucesso');
    }

    // MENSAGEM DE ERRO GERAL
    function mostrarMensagemErroGeral() {
        const aviso = document.createElement('div');
        aviso.classList.add('aviso-erro');
        aviso.innerHTML = '❌ Verifique os campos com erro antes de enviar!';
        
        const fieldset = form.querySelector('fieldset');
        if (fieldset.querySelector('.aviso-erro')) {
            fieldset.querySelector('.aviso-erro').remove();
        }
        fieldset.insertBefore(aviso, fieldset.firstChild);

        setTimeout(() => {
            aviso.classList.add('fechar');
            setTimeout(() => aviso.remove(), 500);
        }, 3000);
    }
}

// ======================================
// EFEITOS DE SCROLL E NAVEGAÇÃO
// ======================================

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animar elementos ao entrar na viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('article, aside, #cadastro').forEach(element => {
    observer.observe(element);
});

// ======================================
// EFEITOS VISUAIS INTERATIVOS
// ======================================

// Adicionar classe ao navegar com teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// Efeito de ripple nos botões
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('✅ Script carregado com sucesso!');

// ======================================
// MOSTRAR SENHA
// ======================================

function inicializarToggleSenha() {
    const btnToggle = document.getElementById('toggleSenha');
    const inputSenha = document.getElementById('senha');

    if (btnToggle) {
        btnToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const tipo = inputSenha.getAttribute('type') === 'password' ? 'text' : 'password';
            inputSenha.setAttribute('type', tipo);
            btnToggle.textContent = tipo === 'password' ? '👁️' : '🙈';
        });
    }

    // Validar força de senha em tempo real
    inputSenha.addEventListener('input', function() {
        const forca = calcularForcaSenha(this.value);
        atualizarForcaBarra(forca);
    });
}

function calcularForcaSenha(senha) {
    if (!senha) return 'nenhuma';

    let score = 0;

    if (senha.length >= 8) score++;
    if (senha.length >= 12) score++;
    if (/[a-z]/.test(senha)) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) score++;

    if (score <= 1) return 'fraca';
    if (score <= 3) return 'media';
    if (score <= 4) return 'forte';
    return 'muito-forte';
}

function atualizarForcaBarra(forca) {
    const barra = document.getElementById('forceBarra');
    const texto = document.getElementById('forceText');
    const textosFor = {
        nenhuma: 'Força: Nenhuma',
        fraca: '⚠️ Força: Fraca',
        media: '⚠️ Força: Média',
        forte: '✓ Força: Forte',
        'muito-forte': '✓ Força: Muito Forte'
    };

    barra.className = 'force-bar ' + forca;
    texto.textContent = textosFor[forca];
}

// ======================================
// SEÇÃO FAQ - ACORDEÃO
// ======================================

function inicializarFAQ() {
    const pergunta = document.querySelectorAll('.faq-pergunta');

    pergunta.forEach(btn => {
        btn.addEventListener('click', function() {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            const respostaId = this.getAttribute('aria-controls');
            const resposta = document.getElementById(respostaId);

            this.setAttribute('aria-expanded', !isOpen);

            if (isOpen) {
                resposta.setAttribute('hidden', '');
            } else {
                resposta.removeAttribute('hidden');
            }
        });

        // Permitir navegação por teclado
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ======================================
// SALVAR RASCUNHO DO FORMULÁRIO
// ======================================

function salvarRascunhoFormulario() {
    const form = document.querySelector('form');
    const dados = {};

    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]').forEach(input => {
        dados[input.id] = input.value;
    });

    localStorage.setItem('rascunhoFormulario', JSON.stringify(dados));
}

function recuperarRascunhoFormulario() {
    const rascunho = localStorage.getItem('rascunhoFormulario');

    if (rascunho) {
        const dados = JSON.parse(rascunho);
        Object.keys(dados).forEach(chave => {
            const input = document.getElementById(chave);
            if (input) {
                input.value = dados[chave];
            }
        });
        mostrarToast('📝 Rascunho recuperado!', 'info');
    }
}

// ======================================
// TOAST NOTIFICATIONS
// ======================================

function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ativo ' + tipo;

    setTimeout(() => {
        toast.classList.remove('ativo');
    }, 3000);
}
