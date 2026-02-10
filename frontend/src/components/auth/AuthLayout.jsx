import { motion } from 'framer-motion';

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  cardClassName = '',
  containerClassName = '',
}) {
  const cardClass = `auth-card ${cardClassName}`.trim();
  const containerClass = `relative flex min-h-screen items-center justify-center px-4 py-12 ${containerClassName}`.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className={containerClass}>
        <motion.div
          variants={cardMotion}
          initial="initial"
          animate="animate"
          className={cardClass}
        >
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
              Caliber
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-100 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
          </div>

          {children}

          {footer ? <div className="mt-6">{footer}</div> : null}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
