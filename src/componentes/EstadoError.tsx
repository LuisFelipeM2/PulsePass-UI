import Aviso from './Aviso'
import Boton from './Boton'
import Tarjeta from './Tarjeta'

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

export default function EstadoError({
  mensaje,
  onReintentar,
}: EstadoErrorProps) {
  return (
    <Tarjeta className="flex flex-col items-center gap-4 p-6">
      <Aviso tipo="error" className="w-full">
        {mensaje}
      </Aviso>
      {onReintentar && <Boton onClick={onReintentar}>Reintentar</Boton>}
    </Tarjeta>
  )
}
