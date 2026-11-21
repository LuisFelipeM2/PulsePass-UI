import { formatearPrecioCOP } from '../lib/formato'

interface PrecioCOPProps {
  valor: number
}

export default function PrecioCOP({ valor }: PrecioCOPProps) {
  return <span>{formatearPrecioCOP(valor)}</span>
}
