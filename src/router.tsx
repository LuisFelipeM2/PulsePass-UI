/* eslint react-refresh/only-export-components: off */
import { createBrowserRouter } from 'react-router'
import Layout from './layouts/Layout'
import { RutaProtegida, RutaPorRol, SoloAnonimo } from './layouts/Guardas'
import ErrorPagina from './pages/ErrorPagina'

const paginas = {
  Inicio: () => import('./pages/Inicio'),
  CatalogoEventos: () => import('./pages/CatalogoEventos'),
  DetalleEvento: () => import('./pages/DetalleEvento'),
  ListaArtistas: () => import('./pages/ListaArtistas'),
  DetalleArtista: () => import('./pages/DetalleArtista'),
  ListaSedes: () => import('./pages/ListaSedes'),
  DetalleSede: () => import('./pages/DetalleSede'),
  Login: () => import('./pages/Login'),
  Registro: () => import('./pages/Registro'),
  Cuenta: () => import('./pages/Cuenta'),
  MisTickets: () => import('./pages/MisTickets'),
  DetalleTicket: () => import('./pages/DetalleTicket'),
  ConfirmacionCompra: () => import('./pages/ConfirmacionCompra'),
  ValidacionIngreso: () => import('./pages/ValidacionIngreso'),
  TicketsPagadosEvento: () => import('./pages/TicketsPagadosEvento'),
  AdminEventos: () => import('./pages/AdminEventos'),
  AdminCrearEvento: () => import('./pages/AdminCrearEvento'),
  AdminGestionEvento: () => import('./pages/AdminGestionEvento'),
  SinPermisos: () => import('./pages/SinPermisos'),
  NoEncontrada: () => import('./pages/NoEncontrada'),
}
type Pagina = keyof typeof paginas
function pagina(nombre: Pagina) {
  return async () => ({ Component: (await paginas[nombre]()).default })
}
export const router = createBrowserRouter([
  { 
    path: '/',
    Component: Layout,
    errorElement: <ErrorPagina />,
    children: [
      { index: true, lazy: pagina('Inicio') },
      { path: 'eventos', lazy: pagina('CatalogoEventos') },
      { path: 'eventos/:eventCode', lazy: pagina('DetalleEvento') },
      { path: 'artistas', lazy: pagina('ListaArtistas') },
      { path: 'artistas/:id', lazy: pagina('DetalleArtista') },
      { path: 'sedes', lazy: pagina('ListaSedes') },
      { path: 'sedes/:code', lazy: pagina('DetalleSede') },
      {
        element: <SoloAnonimo />,
        children: [
          { path: 'login', lazy: pagina('Login') },
          { path: 'registro', lazy: pagina('Registro') },
        ],
      },
      {
        element: <RutaProtegida />,
        children: [
          { path: 'cuenta', lazy: pagina('Cuenta') },
          {
            element: <RutaPorRol roles={['USER']} />,
            children: [
              { path: 'mis-tickets', lazy: pagina('MisTickets') },
              {
                path: 'mis-tickets/:ticketCode',
                lazy: pagina('DetalleTicket'),
              },
              {
                path: 'compra/confirmacion/:ticketCode',
                lazy: pagina('ConfirmacionCompra'),
              },
            ],
          },
          {
            element: <RutaPorRol roles={['STAFF', 'ADMIN']} />,
            children: [
              { path: 'staff/validacion', lazy: pagina('ValidacionIngreso') },
              { path: 'staff/tickets', lazy: pagina('TicketsPagadosEvento') },
              {
                path: 'staff/eventos/:eventCode/tickets',
                lazy: pagina('TicketsPagadosEvento'),
              },
            ],
          },
          {
            element: <RutaPorRol roles={['ADMIN']} />,
            children: [
              { path: 'admin/eventos', lazy: pagina('AdminEventos') },
              { path: 'admin/eventos/nuevo', lazy: pagina('AdminCrearEvento') },
              {
                path: 'admin/eventos/:eventCode',
                lazy: pagina('AdminGestionEvento'),
              },
            ],
          },
        ],
      },
      { path: '403', lazy: pagina('SinPermisos') },
      { path: '*', lazy: pagina('NoEncontrada') },
    ],
  },
])
