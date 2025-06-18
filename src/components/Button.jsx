export const Button = ({
  children,
  onClick,
  variant = "normal",
  className,
  tippyContent,
}) => {
  return (
    <button
      onClick={onClick}
      className={`!p-3 !text-zinc-800 !bg-white hover:!bg-slate-100 hover:!text-zinc-700 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${
        variant === "solid" ? "!bg-white !border !border-zinc-300" : ""
      } ${className ? className : ""}`}
      title={tippyContent}
    >
      {children}
    </button>
  );
};
