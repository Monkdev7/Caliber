import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const panelMotion = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
    },
};

function AuthSplitLayout({
    title,
    subtitle,
    asideTitle,
    asideText,
    asideFooter,
    asideContent,
    children,
    footer,
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
                <section className="flex items-center border-b border-slate-800 bg-slate-900 px-6 py-10 md:border-b-0 md:border-r">
                    <motion.div
                        variants={panelMotion}
                        initial="initial"
                        animate="animate"
                        className="w-full max-w-md"
                    >
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
                            Caliber
                        </p>
                        <h1 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">
                            {asideTitle}
                        </h1>
                        <p className="mt-3 text-sm text-slate-400">{asideText}</p>

                        {asideContent ? (
                            <div className="mt-6">{asideContent}</div>
                        ) : (
                            <>
                                <div className="mt-6 space-y-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-accent" />
                                        <span>Secure access with verified sessions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-accent" />
                                        <span>Stay focused with clean, distraction-free flows</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-accent" />
                                        <span>Keep your job scrapping activity organized</span>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 px-4 py-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                        What you can do
                                    </p>
                                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-accent" />
                                            <span>Track roles across sources in one place</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-accent" />
                                            <span>Export and share shortlists with ease</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-accent" />
                                            <span>Keep job scrapping runs organized</span>
                                        </li>
                                    </ul>
                                    <p className="mt-4 text-xs text-slate-500">
                                        We only store the details you choose to save.
                                    </p>
                                </div>
                            </>
                        )}
                        {asideFooter ? <div className="mt-6">{asideFooter}</div> : null}
                    </motion.div>
                </section>

                <section className="flex items-center justify-center px-6 py-10">
                    <motion.div
                        variants={panelMotion}
                        initial="initial"
                        animate="animate"
                        className="w-full max-w-md"
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
                            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
                        </div>

                        <div className="mb-6 h-px w-full bg-slate-800" />

                        {children}

                        {footer ? <div className="mt-6">{footer}</div> : null}
                    </motion.div>
                </section>
            </div>
        </div>
    );
}

export default AuthSplitLayout;
