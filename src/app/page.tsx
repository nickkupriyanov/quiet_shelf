export default function Home() {
  return (
    <main className="min-h-dvh bg-page p-4 text-primary">
      <section className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-7xl flex-col rounded-[20px] border border-soft bg-shell p-6">
        <p className="font-mono text-sm text-secondary">QuietShelf</p>
        <div className="mt-auto max-w-xl">
          <h1 className="text-4xl font-bold tracking-normal">
            Личная полка для чтения
          </h1>
          <p className="mt-4 text-base leading-7 text-secondary">
            Основа приложения готова. Следующий шаг: доменная модель,
            локальное хранилище и рабочий интерфейс MVP.
          </p>
        </div>
      </section>
    </main>
  );
}
