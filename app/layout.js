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
      <body>{children}</body>
    </html>
  )
}