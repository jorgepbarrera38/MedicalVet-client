<template>
    <div>
      <!--inicio modal acerca de-->
            <div class="modal fade" id="aboutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Acerca de Medical Vet</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      Desarrollado por
                      <h4>Jorge Alexis Paz Barrera</h4>
                      Tel:
                      <a href="tel:+573203719962" target="_blank">
                        +57 3203719962
                      </a> <br>
                      Email:
                      <a href="mailto:jorgepbarrera38@gmail.com" target="_blank">
                        jorgepbarrera38@gmail.com
                      </a>
                      <br>
                      <a href="https://api.whatsapp.com/send?phone=+573203719962" target="_blank">
                        WhatsApp
                      </a>
                      <hr>
                      <h4>DigitalPro</h4> 
                      Tel:
                      <a href="tel:+573214436063" target="_blank">
                        +57 3214436063
                      </a> <br>
                      Email:
                      <a href="mailto:digitalprosoporte@gmail.com" target="_blank">
                        digitalprosoporte@gmail.com
                      </a>
                      <br>
                      <a href="https://www.facebook.com/digitalpro.guaviare/" target="_blank">
                        Facebook
                      </a>
                      <br>
                      <a href="https://api.whatsapp.com/send?phone=+573214436063" target="_blank">
                        WhatsApp
                      </a>
                      <hr>
                      <a class="btn btn-primary" href="https://articulo.mercadolibre.com.co/MCO-598976178-software-veterinario-medical-vet-_JM" target="_blank">
                        <i class="fa fa-hand-o-right" aria-hidden="true"></i> Adquirir Medical Vet
                      </a>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin modal acerca de-->
        <!-- Navbar-->
    <header class="app-header"><span class="app-header__logo">Medical Vet</span>
      <!-- Sidebar toggle button-->
      <a class="app-sidebar__toggle" href="#" @click.prevent="hideOrShowNavBarMovil"></a>
      <!-- Navbar Right Menu-->
      <ul class="app-nav">
        <!-- User Menu-->
        <li class="dropdown"><a class="app-nav__item" href="#" data-toggle="dropdown" aria-label="Open Profile Menu"><i class="fa fa-user fa-lg"></i></a>
          <ul class="dropdown-menu settings-menu dropdown-menu-right">
            <li>
              <a class="dropdown-item" href="" @click.prevent="logout">
                <i class="fa fa-sign-out fa-lg"></i> Salir
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
    <!-- Sidebar menu-->
    <div class="app-sidebar__overlay" data-toggle="sidebar"></div>
    <Sidebar/>
    <main class="app-content">
      <router-view></router-view>
    </main>
    </div>
</template>
<script>
  import Sidebar from './partials/Sidebar'
  export default {
    components: { Sidebar },
    methods: {
      logout () {
        this.$http.post('auth/logout')
        localStorage.removeItem('access_token')
        localStorage.removeItem('names_user')
        localStorage.removeItem('name_user')
        localStorage.removeItem('permissions')
        this.$router.push({ name: 'login' })
      },
      hideOrShowNavBarMovil () {
        let body = document.getElementsByTagName('body')[0]

        if (body.classList.contains('sidenav-toggled')) {
          document.getElementsByTagName('body')[0].classList.remove('sidenav-toggled')
        } else {
          document.getElementsByTagName('body')[0].classList.add('sidenav-toggled')
        }
      }
    },
  }
</script>