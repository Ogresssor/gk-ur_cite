import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-40 pb-32 text-center sm:px-6">
      <p className="font-mono text-sm text-steel">404 — обрыв линии</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Такой страницы нет</h1>
      <p className="mt-4 text-steel">Возможно, ссылка устарела. Вернитесь на главную или посчитайте стоимость проекта.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-graphite px-6 py-3 font-semibold text-white">На главную</Link>
        <Link href="/#calculator" className="rounded-xl border border-line bg-surface px-6 py-3 font-semibold">Калькулятор</Link>
      </div>
    </div>
  );
}
