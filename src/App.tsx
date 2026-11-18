export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <h1 className="font-titulo text-3xl font-bold text-marca-600">PulsePass</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        El cuerpo del texto usa Inter.
      </p>
      <button className="mt-4 rounded-lg bg-marca-600 px-4 py-2 font-medium text-white hover:bg-marca-700">
        Primario
      </button>
      <div className="mt-6 h-20 rounded-xl bg-linear-to-r from-marca-600 to-acento-500" />
    </main>
  )
}