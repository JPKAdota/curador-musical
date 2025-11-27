'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Cadastro da Marca', icon: '📝' },
        { href: '/marcas', label: 'Marcas', icon: '🏢' },
        { href: '/musicas', label: 'Músicas', icon: '🎵' },
        { href: '/analise', label: 'Análise', icon: '📊' }
    ];

    return (
        <nav className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎧</span>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            AI Music Curator
                        </h1>
                    </div>

                    <div className="flex space-x-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    flex items-center space-x-2
                    ${isActive
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                                >
                                    <span>{item.icon}</span>
                                    <span className="hidden md:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
