import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Don't show modal on mobile devices
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
            setIsOpen(true);
        }

        // Add resize listener to close modal if window is resized to mobile size
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Clean up event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 sm:max-w-[90%] md:max-w-5xl border-0 bg-transparent shadow-none overflow-hidden">
                <div className="flex flex-col md:flex-row rounded-xl overflow-hidden relative">
                    {/* Close button - visible on all screen sizes */}
                    <DialogClose
                        className="absolute right-2 top-2 z-50 bg-gray-800/70 rounded-full p-1.5 hover:bg-gray-700/90 text-white"
                        onClick={handleClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span className="sr-only">Close</span>
                    </DialogClose>

                    {/* Left side - Purple with image */}
                    <div className="relative w-full md:w-2/5 bg-purple-900 py-6 md:py-8 flex flex-col items-center px-3 md:px-4">
                        {/* Text on top */}
                        <div className="text-center text-white w-full mb-4 md:mb-12 px-4">
                            <h2 className="font-['Press_Start_2P'] text-lg md:text-xl mb-2 md:mb-3">Detective Pepe</h2>
                            <p className="font-mono text-xs md:text-sm">is here to investigate memecrimes.</p>
                        </div>

                        {/* Image from bottom left */}
                        <div className="w-full mt-auto flex justify-start">
                            <div className="relative w-52 h-52 md:w-96 md:h-96 -translate-x-4 md:-translate-x-14">
                                <img
                                    src="/assets/detetctive_pepe.png"
                                    alt="Detective Pepe"
                                    className="w-full h-full object-contain transform scale-x-[-1] translate-y-6 md:translate-y-12 -translate-x-2 md:-translate-x-4" // Flip horizontally and position
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side - Translucent glassy black with stronger blur */}
                    <div className="w-full md:w-3/5 bg-black/70 backdrop-blur-xl p-5 md:p-8 text-white flex flex-col border-l border-purple-500/20">
                        <div className="flex-grow mb-4 md:mb-8">
                            <h1 className="font-['Press_Start_2P'] text-xl md:text-2xl mb-3 md:mb-6">Welcome to PepLock</h1>
                            <h2 className="font-mono text-lg md:text-xl mb-2 md:mb-4">Your Memecoin Investigation Platform</h2>
                            <p className="mb-4 md:mb-6 text-gray-300 font-mono text-xs md:text-sm">
                                PepLock helps you track, analyze, and investigate memecoins on Solana.
                                Get real-time data, risk assessments, and market insights to make informed decisions.
                            </p>
                            <div className="border-t border-gray-700 pt-4 md:pt-6 mt-auto">
                                <h3 className="font-['Press_Start_2P'] text-base md:text-lg mb-2 md:mb-3">Limitations</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1 md:space-y-2 font-mono text-xs md:text-sm">
                                    <li>Data is refreshed every 1 hour manually</li>
                                    <li>Risky Analysis of only top tokens is available</li>
                                    <li>In-Depth Analysis of only 1 token is avaliable</li>
                                    <li>GofundMeme analysis is coming soon</li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-full py-2 md:py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-['Press_Start_2P'] text-xs md:text-sm transition-colors"
                        >
                            Let's Begin
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 