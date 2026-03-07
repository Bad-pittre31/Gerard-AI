import React from 'react';
import { motion } from 'motion/react';
import {
    Briefcase, Cpu, MessageCircle, Zap, Quote, ChevronRight,
    Server, Brain, BarChart3, Share2, Lightbulb, Flame,
    ShieldAlert, TrendingUp, Clock
} from 'lucide-react';
import { AcornLogo } from './AcornLogo';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
};

// === Gogole™ Logo Component ===
function GogoleLogo({ className = '' }: { className?: string }) {
    const letters = [
        { char: 'G', color: '#4285F4' },
        { char: 'o', color: '#EA4335' },
        { char: 'g', color: '#FBBC05' },
        { char: 'o', color: '#4285F4' },
        { char: 'l', color: '#34A853' },
        { char: 'e', color: '#EA4335' },
    ];
    return (
        <span className={`inline-flex items-baseline ${className}`} style={{ fontFamily: "'Inter', sans-serif" }}>
            {letters.map((l, i) => (
                <span
                    key={i}
                    style={{
                        color: l.color,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        transform: i === 2 ? 'rotate(-2deg)' : i === 4 ? 'rotate(1deg)' : undefined,
                        display: 'inline-block',
                    }}
                >
                    {l.char}
                </span>
            ))}
            <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: '0.55em', verticalAlign: 'super', marginLeft: 2 }}>™</span>
        </span>
    );
}

const useCases = [
    {
        icon: <Share2 className="w-6 h-6" />,
        title: "Générer des posts LinkedIn absurdes",
        description: "Gérard rédige des posts inspirationnels qui n'inspirent personne. Mais avec conviction."
    },
    {
        icon: <Lightbulb className="w-6 h-6" />,
        title: "Trouver des idées business douteuses",
        description: "Des concepts de startup qui n'auraient jamais dû quitter le brainstorming."
    },
    {
        icon: <Flame className="w-6 h-6" />,
        title: "Roast tes amis en soirée",
        description: "Gérard analyse tes amis et leur envoie des punchlines des années 90."
    },
    {
        icon: <Briefcase className="w-6 h-6" />,
        title: "Simuler un commercial des années 90",
        description: "Techniques de vente obsolètes livrées avec une assurance absolue."
    },
    {
        icon: <ShieldAlert className="w-6 h-6" />,
        title: "Trouver des excuses professionnelles",
        description: "Des excuses si créatives que même les RH seraient impressionnées."
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Générer des arguments de vente confiants",
        description: "Des arguments commerciaux totalement infondés mais livrés avec aplomb."
    }
];

const techStack = [
    {
        icon: <Server className="w-5 h-5" />,
        name: "Gogole™ Cloud Infrastructure",
        description: "Infrastructure cloud de niveau mondial. Ou presque."
    },
    {
        icon: <Cpu className="w-5 h-5" />,
        name: "Geremi 3.9 Pro Large Confident Model",
        description: "Notre modèle phare. Plus grand, plus confiant, pas forcément plus juste."
    },
    {
        icon: <BarChart3 className="w-5 h-5" />,
        name: "Neural Sales Pipeline Engine™",
        description: "Le premier moteur neuronal dédié à la vente approximative."
    }
];

const timeline = [
    {
        period: "1990 – 2005",
        title: "Roi du fax et du maxi-classeur",
        description: "Gérard règne en maître sur les salons professionnels. Il porte un costume croisé et distribue des cartes de visite à tout le monde."
    },
    {
        period: "2005 – 2023",
        title: "A essayé la technologie. A échoué.",
        description: "Gérard a ouvert un compte LinkedIn en 2017. Il ne s'en est jamais remis. Il appelle encore Internet « le web mondial »."
    },
    {
        period: "2024 – Aujourd'hui",
        title: "Est devenu une IA. Ne comprend toujours pas pourquoi.",
        description: "Grâce à la technologie Gogole™, Gérard continue de prodiguer ses conseils. Avec le même niveau d'expertise."
    }
];

export function AboutPage({ onNavigateToChat }: { onNavigateToChat: () => void }) {
    return (
        <div className="min-h-screen bg-beige-50 relative overflow-x-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-acorn-100/40 via-acorn-50/20 to-transparent pointer-events-none" />
            <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-caramel-400/5 to-transparent rounded-full pointer-events-none blur-3xl" />

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div {...fadeInUp}>
                        <div className="inline-flex items-center gap-2 bg-acorn-100/60 border border-acorn-200/50 rounded-full px-4 py-1.5 mb-8">
                            <Zap className="w-3.5 h-3.5 text-caramel-500" />
                            <span className="text-xs font-semibold text-acorn-700 tracking-wide uppercase">Powered by Geremi 3.9 Pro</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-acorn-900 mb-6"
                    >
                        À propos de{' '}
                        <span className="bg-gradient-to-r from-caramel-500 to-acorn-500 bg-clip-text text-transparent">
                            Gérard AI
                        </span>
                    </motion.h1>

                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
                        <p className="text-xl sm:text-2xl font-medium text-acorn-600 mb-2">
                            Une intelligence artificielle révolutionnaire.
                        </p>
                        <p className="text-xl sm:text-2xl font-medium text-acorn-400 italic">
                            Ou presque.
                        </p>
                    </motion.div>

                    <motion.p
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.3 }}
                        className="max-w-xl mx-auto text-acorn-900/70 mt-8 text-base sm:text-lg leading-relaxed"
                    >
                        Gérard AI est une IA d'un nouveau genre.
                        Elle ne comprend pas vraiment ce qu'elle fait,
                        mais elle le fait avec une confiance remarquable.
                    </motion.p>

                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }}>
                        <button
                            onClick={onNavigateToChat}
                            className="mt-10 inline-flex items-center gap-2 bg-acorn-900 hover:bg-acorn-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-sm group"
                        >
                            Découvrir Gérard
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ===== QUI EST GÉRARD ===== */}
            <section className="relative py-24 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div {...fadeInUp}>
                        <div className="inline-flex items-center gap-2 mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-caramel-500 to-acorn-400 rounded-full" />
                            <h2 className="text-sm font-semibold text-caramel-500 uppercase tracking-wider">Qui est Gérard</h2>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.1 }}
                        className="bg-white rounded-2xl border border-acorn-900/8 shadow-sm p-8 sm:p-10"
                    >
                        <p className="text-lg sm:text-xl leading-relaxed text-acorn-900/80 mb-6">
                            Gérard est un ancien commercial des années 90.{' '}
                            <span className="text-caramel-500 font-medium">Extrêmement confiant.</span>{' '}
                            Totalement dépassé par la technologie.{' '}
                            Persuadé d'être un expert en tout.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed text-acorn-900/70 mb-6">
                            Il a vendu :
                        </p>
                        <ul className="space-y-3 mb-8">
                            {['des minitels', 'des fax', 'des solutions CRM installées sur CD-ROM', 'des abonnements Wanadoo'].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                                    className="flex items-start gap-3 text-acorn-900/70"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-caramel-500 mt-2.5 shrink-0" />
                                    <span className="text-base sm:text-lg">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                        <p className="text-base sm:text-lg leading-relaxed text-acorn-900/70 mb-6">
                            Il n'a jamais vraiment compris Internet, mais cela ne l'a jamais empêché de donner son avis.
                            Sa plus grande qualité ? <span className="italic text-acorn-600">Il ne doute jamais.</span>
                        </p>
                        <div className="border-t border-acorn-900/5 pt-6">
                            <p className="text-base sm:text-lg leading-relaxed text-acorn-900/80 font-medium">
                                Aujourd'hui, grâce aux dernières avancées en intelligence artificielle,
                                Gérard continue de prodiguer ses conseils.
                            </p>
                            <p className="text-base sm:text-lg text-acorn-600 italic mt-2">
                                Avec le même niveau d'expertise.
                            </p>
                        </div>
                    </motion.div>

                    {/* ===== TIMELINE ===== */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.2 }}
                        className="mt-10"
                    >
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-caramel-400 via-acorn-300 to-acorn-200 hidden sm:block" />
                            <div className="space-y-6">
                                {timeline.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                                        className="flex gap-4 sm:gap-6 items-start"
                                    >
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-white border-2 border-caramel-400/60 flex items-center justify-center shadow-sm z-10">
                                            <Clock className="w-4 h-4 text-caramel-500" />
                                        </div>
                                        <div className="bg-white rounded-xl border border-acorn-900/8 p-5 sm:p-6 shadow-sm flex-1">
                                            <p className="text-xs font-semibold text-caramel-500 uppercase tracking-wider mb-1">{item.period}</p>
                                            <h4 className="font-semibold text-acorn-900 mb-1 text-base">{item.title}</h4>
                                            <p className="text-sm text-acorn-900/60 leading-relaxed">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== TECHNOLOGIE ===== */}
            <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-acorn-50/30 to-transparent">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-caramel-500 to-acorn-400 rounded-full" />
                            <h2 className="text-sm font-semibold text-caramel-500 uppercase tracking-wider">Technologie</h2>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-acorn-900 tracking-tight">
                            Une technologie de pointe
                        </h3>
                    </motion.div>

                    {/* Powered by section — SaaS-style partner logos */}
                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="mb-14">
                        <div className="bg-white rounded-2xl border border-acorn-900/8 shadow-sm p-8 sm:p-10">
                            <p className="text-xs font-semibold text-acorn-900/40 uppercase tracking-wider text-center mb-8">Powered by</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                                {/* Gogole logo */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 border border-acorn-900/5 flex items-center justify-center shadow-sm">
                                        <span className="text-2xl font-black" style={{ color: '#4285F4' }}>G</span>
                                    </div>
                                    <GogoleLogo className="text-lg" />
                                    <p className="text-xs text-acorn-900/40">AI Infrastructure</p>
                                </div>

                                {/* Divider */}
                                <div className="hidden sm:block w-px h-16 bg-acorn-900/8" />
                                <div className="block sm:hidden h-px w-16 bg-acorn-900/8" />

                                {/* Geremi */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-acorn-100 to-caramel-100 border border-acorn-900/5 flex items-center justify-center shadow-sm">
                                        <Brain className="w-7 h-7 text-acorn-700" />
                                    </div>
                                    <p className="text-lg font-bold text-acorn-900">Geremi <span className="text-caramel-500">3.9</span> Pro</p>
                                    <p className="text-xs text-acorn-900/40">Large Confident Model</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tech cards */}
                    <div className="grid md:grid-cols-3 gap-5">
                        {techStack.map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                                className="bg-white rounded-xl border border-acorn-900/8 p-6 shadow-sm hover:shadow-md hover:border-caramel-400/30 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-acorn-100 text-acorn-700 flex items-center justify-center mb-4 group-hover:bg-caramel-500/10 group-hover:text-caramel-500 transition-colors">
                                    {tech.icon}
                                </div>
                                <h4 className="font-semibold text-acorn-900 mb-2 text-sm">
                                    {tech.name}
                                </h4>
                                <p className="text-sm text-acorn-900/60 leading-relaxed">
                                    {tech.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.4 }}
                        className="text-center text-acorn-900/60 mt-12 max-w-lg mx-auto text-base leading-relaxed italic"
                    >
                        Notre modèle repose sur des décennies d'expérience commerciale approximative
                        et d'intuitions totalement assumées.
                    </motion.p>
                </div>
            </section>

            {/* ===== CE QUE VOUS POUVEZ FAIRE AVEC GÉRARD AI ===== */}
            <section className="relative py-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-caramel-500 to-acorn-400 rounded-full" />
                            <h2 className="text-sm font-semibold text-caramel-500 uppercase tracking-wider">Capacités</h2>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-acorn-900 tracking-tight">
                            Ce que vous pouvez faire avec Gérard AI
                        </h3>
                        <p className="text-acorn-900/60 mt-4 max-w-lg mx-auto text-base leading-relaxed">
                            Six façons de profiter de 30 ans d'expérience commerciale… discutable.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {useCases.map((useCase, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                                className="bg-white rounded-xl border border-acorn-900/8 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-caramel-400/30 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-acorn-100 text-acorn-700 flex items-center justify-center mb-5 group-hover:bg-caramel-500/10 group-hover:text-caramel-500 transition-colors">
                                    {useCase.icon}
                                </div>
                                <h4 className="font-semibold text-acorn-900 mb-2 text-base">
                                    {useCase.title}
                                </h4>
                                <p className="text-sm text-acorn-900/60 leading-relaxed">
                                    {useCase.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PHILOSOPHIE ===== */}
            <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-acorn-50/40 to-transparent">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div {...fadeInUp}>
                        <div className="bg-white rounded-2xl border border-acorn-900/8 shadow-sm p-10 sm:p-14 relative">
                            <Quote className="w-10 h-10 text-caramel-400/30 absolute top-6 left-6" />
                            <Quote className="w-10 h-10 text-caramel-400/30 absolute bottom-6 right-6 rotate-180" />
                            <blockquote className="text-2xl sm:text-3xl font-semibold text-acorn-900 leading-snug mb-6 relative z-10">
                                Dans le doute, parle plus fort que les autres.
                            </blockquote>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                    <AcornLogo className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-acorn-900">Gérard</p>
                                    <p className="text-xs text-acorn-900/50">1998</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="py-10 border-t border-acorn-900/5 bg-beige-100/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2 opacity-50">
                        <AcornLogo className="w-6 h-6" />
                        <span className="text-sm font-semibold">Gérard AI</span>
                    </div>
                    <p className="text-xs text-acorn-900/40 max-w-md leading-relaxed">
                        Aucune intelligence artificielle réelle n'a été blessée dans la création de Gérard.
                    </p>
                    <p className="text-xs text-acorn-900/30">
                        © 1998–2026 Gérard Enterprises™ — Tous droits approximativement réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
}
