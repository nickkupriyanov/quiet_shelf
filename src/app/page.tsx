export default function Home() {
  return (
    <section className="flex min-h-[520px] flex-col justify-end rounded-[20px] border border-border-soft bg-card p-6">
      <p className="font-mono text-sm text-secondary">QuietShelf</p>
      <div className="mt-24 max-w-xl">
        <h1 className="text-4xl font-bold tracking-normal">
          Личная полка для чтения
        </h1>
        <p className="mt-4 text-base leading-7 text-secondary">
          Основа приложения готова. Следующий шаг: рабочий домашний экран,
          библиотека и быстрый прогресс чтения.
        </p>
      </div>
    </section>
  );
}
