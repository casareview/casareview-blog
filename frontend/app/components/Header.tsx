'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  settings?: any;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/tecnologia', label: 'Tecnologia' },
    { href: '/decoracao', label: 'Decoração' },
    { href: '/manutencao', label: 'Manutenção' },
    { href: '/jardim-plantas', label: 'Jardim e Plantas' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="fixed z-50 h-24 inset-0 bg-[#0038A5] flex items-center backdrop-blur-lg">
        <div className="container py-6 px-2 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            {/* Logo */}
            <Link className="flex items-center gap-2" href="/" onClick={closeMobileMenu}>
              <Image 
                src='/images/casareview-logo.svg' 
                alt='Logo CasaReview' 
                width={110} 
                height={34} 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className='flex gap-6'>
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      className='text-white transition-all hover:text-[#04EEFF]'  
                      href={item.href}
                    >
                      {item.label}
                    </Link>              
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Full Screen */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0038A5] md:hidden">
          <div className="flex items-center justify-between p-6 pt-8">
            <Link className="flex items-center gap-2" href="/" onClick={closeMobileMenu}>
              <Image 
                src='/images/casareview-logo.svg' 
                alt='Logo CasaReview' 
                width={110} 
                height={34} 
              />
            </Link>
            
            {/* Close button */}
            <button
              type="button"
              className="text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={closeMobileMenu}
              aria-label="Fechar menu"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="px-6 pt-6">
            <ul className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    className='block text-white text-2xl py-4 border-b border-blue-400 transition-all hover:text-[#04EEFF] focus:outline-none focus:text-[#04EEFF]'  
                    href={item.href}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>              
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}