import Link from 'next/link'
export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="container p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">MI AL HIKMAH</h1>
          <p className="text-sm text-gray-600">Yayasan Hikmatul Amin — Akreditasi B</p>
        </div>
        <nav className="space-x-4 hidden md:block">
          <Link href="#profil"><a className="text-sm">Profil</a></Link>
          <Link href="#ppdb"><a className="text-sm">PPDB</a></Link>
          <Link href="#galeri"><a className="text-sm">Galeri</a></Link>
          <Link href="#kontak"><a className="text-sm">Kontak</a></Link>
        </nav>
      </div>
    </header>
  )
}
