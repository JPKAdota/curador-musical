import Navigation from '../components/Navigation'

export const metadata = {
  title: 'Curador Musical Inteligente',
  description: 'Player Web Corporativo - MVP Gratuito',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
        <Navigation />
        {children}
      </body>
    </html>
  )
}