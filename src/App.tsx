export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <h1 className="font-titulo text-marca-600 text-3xl font-bold">
        PulsePass
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        El cuerpo del texto usa Inter.
      </p>
      <button className="bg-marca-600 hover:bg-marca-700 mt-4 rounded-lg px-4 py-2 font-medium text-white">
        Primario
      </button>
      <div className="from-marca-600 to-acento-500 mt-6 h-20 rounded-xl bg-linear-to-r" />
    </main>
  )
}
