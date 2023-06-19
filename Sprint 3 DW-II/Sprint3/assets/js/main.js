const app = Vue.createApp({
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      showLoginForm: false,
      showRegisterForm: false,
      showProducts: false,
      showCart: false,
      loginForm: {
        username: '',
        password: ''
      },

      registerForm: {
        username: '',
        password: ''
      },

      users: [],
      products: [
        {
          id: 1,
          name: 'GTS M1 I-VTEC GX DEORE 1X12',
          price: 'R$ 5578.20',
          image: 'https://static3.tcdn.com.br/img/img_prod/394779/bicicleta_gts_aro_29_freio_a_disco_shimano_hidraulico_cambio_shimano_deore_1x12_marchas_e_suspensao__3743_1_d43363e75d08aa363ec39663d39d4edf_20220530170213.jpg',
          editing: false
        },

        {
          id: 2,
          name: 'BICICLETA GRAVEL GTSM1 CARBON FREIO A DISCO KIT SHIMANO GRX 2X11V',
          price: 'R$ 22499.10',
          image: 'https://static3.tcdn.com.br/img/img_prod/394779/bicicleta_gravel_gtsm1_carbon_freio_a_disco_kit_shimano_grx_2x11v_4525_1_b1ff618b7bb6bf888c392011babadc8f.jpg',
          editing: false
        },

        {
          id: 3,
          name: 'BICICLETA GTS ARO 20 FREIO A DISCO ALUMÍNIO | GTS M1 SKX BMX',
          price: 'R$ 917.10',
          image: 'https://static3.tcdn.com.br/img/img_prod/394779/bicicleta_gts_aro_20_freio_a_disco_aluminio_gts_m1_skx_bmx_943_variacao_6436_1_3e2889b17f55ea7d25c957f1540d2135.jpg',
          editing: false
        }
      ],

      cart: []
    };
  },
  created() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      this.users.push(JSON.parse(adminUser));
    }
  },

  methods: {
    toggleLoginForm() {
      this.showLoginForm = !this.showLoginForm;
      this.showRegisterForm = false;
      this.clearForms();
    },
    
    toggleRegisterForm() {
      this.showRegisterForm = !this.showRegisterForm;
      this.showLoginForm = false;
      this.clearForms();
    },

    toggleProducts() {
      this.showProducts = !this.showProducts;
      this.showCart = false;
    },

    toggleCart() {
      this.showCart = !this.showCart;
      this.showProducts = false;
    },

    login() {
      const { username, password } = this.loginForm;
      const user = this.users.find(
        (user) => user.username === username && user.password === password
      );      
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = username === 'admin';
        this.showLoginForm = false;
        this.clearForms();
      } else {
        alert('Usuário ou senha incorretos.');
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.clearForms();
    },

    register() {
      const { username, password } = this.registerForm;
      const userExists = this.users.some((user) => user.username === username);
      if (userExists) {
        alert('Nome de usuário já está em uso.');
      } else {
        this.users.push({ username, password });
        if (username === 'admin' && password === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify({ username, password }));
        }
        this.showRegisterForm = false;
        alert('Registro realizado com sucesso. Faça login para continuar.');
        this.clearForms();
      }
    },

    addToCart(product) {
      if (this.isLoggedIn) {
        const cartItem = this.cart.find(
          (item) => item.product.id === product.id
        );
        if (cartItem) {
          cartItem.quantity++;
        } else {
          this.cart.push({ product, quantity: 1 });
        }
      } else {
        alert('Faça login ou registre-se para adicionar ao carrinho.');
        this.showLoginForm = true;
      }
    },

    removeFromCart(cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        const index = this.cart.findIndex(
          (item) => item.product.id === cartItem.product.id
        );
        if (index !== -1) {
          this.cart.splice(index, 1);
        }
      }
    },

    clearForms() {
      this.loginForm.username = '';
      this.loginForm.password = '';
      this.registerForm.username = '';
      this.registerForm.password = '';
    },

    goToHomePage() {
      window.location.href = '/';
    },

    editProduct(product) {
      if (this.isLoggedIn && this.isAdmin) {
        product.editing = true;
      } else {
        alert('Apenas o usuário admin tem permissão para editar produtos.');
      }
    },

    saveProduct(product) {
      product.editing = false;
      console.log('Produto editado:', product);
    },

    cancelEdit(product) {
      product.editing = false;
    },

    removeProduct(product) {
      if (this.isLoggedIn && this.isAdmin) {
        const index = this.products.findIndex(
          (item) => item.id === product.id
        );
        if (index !== -1) {
          this.products.splice(index, 1);
        }
      } else {
        alert('Apenas o usuário admin tem permissão para excluir produtos.');
      }
    },

    getTotalPrice() {
      return this.cart.reduce((total, item) => {
        const price = parseFloat(item.product.price.replace('R$', '').replace(',', '.'));
        return total + price * item.quantity;
      }, 0);
    },

    finalizarCompra() {
      if (this.cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
        return;
      }
      const total = this.getTotalPrice();
      alert(`Total da compra: R$ ${total.toFixed(2)}`);
      const formaPagamento = prompt('Selecione a forma de pagamento (Digite o número):\n1. Cartão de Crédito\n2. Boleto\n3. Transferência Bancária');
      if (formaPagamento === '1') {
        alert('Você selecionou Cartão de Crédito. Redirecionando para a página de pagamento...');
      } else if (formaPagamento === '2') {
        alert('Você selecionou Boleto. Aguarde o boleto ser gerado...');
      } else if (formaPagamento === '3') {
        alert('Você selecionou Transferência Bancária. Aguarde as instruções para realizar a transferência...');
      } else {
        alert('Forma de pagamento inválida.');
      }
    }
  }
});

app.mount('#app');
