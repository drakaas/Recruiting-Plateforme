import NavBar from '../common/NavBar'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  )
}


