"use client"

export function ScrollToFormButton() {
  return (
    <button
      onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
      className="flex flex-col items-center group"
      title="Vai al form di contatto"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m4 4 16 0 0 16-16 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m22 6-10 7L2 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xs text-center select-none">Email</span>
    </button>
  );
}