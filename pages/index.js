import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { downloadCSV } from '../components/csvUtil'

const SCHOOL = {
  name: 'MI AL HIKMAH',
  foundation: 'Yayasan Hikmatul Amin',
  address: 'Jl. Ubalan No. 1, Ds. Ngampungan, Kec. Bareng, Kab. Jombang, Jawa Timur 61474',
  nsm: '111235170014',
  npsn: '60717345',
  phone: '082332753852',
  accreditation: 'B',
  email: 'info@mi-alhikmah.sch.id'
}

export default function Home(){
  const [ppdb, setPpdb] = useState({ nama:'', nik:'', ttl:'', alamat:'', wali:'', telp:'', asal:'' })
  const [ppdbList, setPpdbList] = useState([])
  const [aduan, setAduan] = useState({ nama:'', telp:'', pesan:'' })
  const [aduanList, setAduanList] = useState([])
  const [galleryFiles, setGalleryFiles] = useState([])

  useEffect(()=>{ const p = localStorage.getItem('ppdb_submissions'); const a = localStorage.getItem('aduan_submissions'); const g = localStorage.getItem('gallery_photos'); if(p) setPpdbList(JSON.parse(p)); if(a) setAduanList(JSON.parse(a)); if(g) setGalleryFiles(JSON.parse(g)); },[])
  useEffect(()=>{ localStorage.setItem('ppdb_submissions', JSON.stringify(ppdbList)); },[ppdbList])
  useEffect(()=>{ localStorage.setItem('aduan_submissions', JSON.stringify(aduanList)); },[aduanList])
  useEffect(()=>{ localStorage.setItem('gallery_photos', JSON.stringify(galleryFiles)); },[galleryFiles])

  const submitPpdb = (e)=>{ e.preventDefault(); if(!ppdb.nama||!ppdb.nik||!ppdb.telp) return alert('Lengkapi Nama, NIK, dan Telp.'); const next = [...ppdbList, {...ppdb, tanggal: new Date().toISOString()}]; setPpdbList(next); setPpdb({ nama:'', nik:'', ttl:'', alamat:'', wali:'', telp:'', asal:'' }); alert('Pendaftaran terkirim (tersimpan di browser).') }
  const submitAduan = (e)=>{ e.preventDefault(); if(!aduan.nama||!aduan.pesan) return alert('Isi nama dan pesan.'); const next = [...aduanList, {...aduan, tanggal: new Date().toISOString()}]; setAduanList(next); setAduan({ nama:'', telp:'', pesan:'' }); alert('Pengaduan terkirim (tersimpan di browser).') }

  const onGalleryChange = async (e)=>{ const files = Array.from(e.target.files||[]); const toBase64 = f => new Promise((res, rej)=>{ const reader = new FileReader(); reader.onload = ()=> res(reader.result); reader.onerror = rej; reader.readAsDataURL(f); }); const encoded = await Promise.all(files.map(f=> toBase64(f))); const next = [...galleryFiles, ...encoded.map((d,i)=>({data:d, name:'foto_'+Date.now()+'_'+i+'.jpg'}))]; setGalleryFiles(next) }

  return (
    <div>
      <Header />
      <main className="container p-6 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Profil Sekolah</h2>
            <p className="text-sm text-gray-700 mt-2">MI Al Hikmah adalah lembaga pendidikan dasar yang memadukan nilai keislaman dan ilmu umum. Konten dapat diedit melalui file di repo.</p>
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold">PPDB — Formulir Pendaftaran</h2>
            <form onSubmit={submitPpdb} className="grid md:grid-cols-2 gap-3">
              <input value={ppdb.nama} onChange={e=>setPpdb({...ppdb,nama:e.target.value})} placeholder="Nama Calon Siswa *" className="p-2 border rounded" />
              <input value={ppdb.nik} onChange={e=>setPpdb({...ppdb,nik:e.target.value})} placeholder="NIK *" className="p-2 border rounded" />
              <input value={ppdb.ttl} onChange={e=>setPpdb({...ppdb,ttl:e.target.value})} placeholder="Tempat/Tgl Lahir" className="p-2 border rounded" />
              <input value={ppdb.asal} onChange={e=>setPpdb({...ppdb,asal:e.target.value})} placeholder="Asal TK/RA" className="p-2 border rounded" />
              <textarea value={ppdb.alamat} onChange={e=>setPpdb({...ppdb,alamat:e.target.value})} placeholder="Alamat lengkap" className="p-2 border rounded md:col-span-2" />
              <input value={ppdb.wali} onChange={e=>setPpdb({...ppdb,wali:e.target.value})} placeholder="Nama Orang Tua/Wali" className="p-2 border rounded" />
              <input value={ppdb.telp} onChange={e=>setPpdb({...ppdb,telp:e.target.value})} placeholder="Telp/HP *" className="p-2 border rounded" />
              <div className="md:col-span-2 text-right">
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Kirim Pendaftaran</button>
              </div>
            </form>
            <div className="mt-4">
              <button onClick={()=>downloadCSV('ppdb.csv', ppdbList)} className="px-3 py-2 bg-gray-800 text-white rounded mr-2">Export CSV PPDB</button>
              <button onClick={()=>{ localStorage.removeItem('ppdb_submissions'); setPpdbList([]); }} className="px-3 py-2 border rounded">Hapus Semua (PPDB)</button>
            </div>
            {ppdbList.length>0 && (<div className="mt-3 text-sm"><h4 className="font-semibold">Daftar Pendaftar (di device ini)</h4><ul className="list-disc list-inside">{ppdbList.map((p,i)=> <li key={i}>{p.nama} — {p.telp} ({new Date(p.tanggal).toLocaleString()})</li>)}</ul></div>)}
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold">Pengaduan</h2>
            <form onSubmit={submitAduan} className="grid gap-2">
              <input value={aduan.nama} onChange={e=>setAduan({...aduan,nama:e.target.value})} placeholder="Nama *" className="p-2 border rounded" />
              <input value={aduan.telp} onChange={e=>setAduan({...aduan,telp:e.target.value})} placeholder="Telp" className="p-2 border rounded" />
              <textarea value={aduan.pesan} onChange={e=>setAduan({...aduan,pesan:e.target.value})} placeholder="Isi pengaduan *" className="p-2 border rounded" rows={4} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>downloadCSV('pengaduan.csv', aduanList)} className="px-3 py-2 bg-gray-800 text-white rounded">Export CSV Pengaduan</button>
                <button type="submit" className="px-3 py-2 bg-amber-600 text-white rounded">Kirim Pengaduan</button>
              </div>
            </form>
            {aduanList.length>0 && (<div className="mt-3 text-sm"><h4 className="font-semibold">Daftar Pengaduan (di device ini)</h4><ul className="list-disc list-inside">{aduanList.map((a,i)=> <li key={i}>{a.nama}: {a.pesan.slice(0,80)}… ({new Date(a.tanggal).toLocaleString()})</li>)}</ul></div>)}
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold">Galeri Foto (unggah & simpan di browser)</h2>
            <p className="text-sm text-gray-600">Untuk demo, foto disimpan sebagai base64 di browser. Untuk produksi, gunakan API upload server.</p>
            <input type="file" multiple accept="image/*" onChange={onGalleryChange} />
            <div className="grid grid-cols-3 gap-2 mt-3">
              {galleryFiles.map((g,i)=> (
                <div key={i} className="bg-gray-100 p-1 rounded">
                  <img src={g.data} alt={g.name} className="w-full h-28 object-cover rounded" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>{ downloadCSV('gallery_index.csv', galleryFiles.map((x,i)=>({filename:x.name || `foto${i+1}.jpg`, index:i})))}} className="px-3 py-2 bg-gray-800 text-white rounded">Export Index CSV</button>
              <button onClick={()=>{ localStorage.removeItem('gallery_photos'); setGalleryFiles([]); }} className="px-3 py-2 border rounded">Hapus Galeri</button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow text-sm">
            <h3 className="font-semibold">Kontak Cepat</h3>
            <p className="mt-2">{SCHOOL.phone}</p>
            <p>{SCHOOL.email}</p>
            <a className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded" href={`https://wa.me/62${SCHOOL.phone.replace(/^0/,'')}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin informasi PPDB di MI Al Hikmah.")}`} target="_blank" rel="noreferrer">Chat via WhatsApp</a>
          </div>

          <div className="bg-white p-4 rounded shadow text-sm">
            <h3 className="font-semibold">Identitas</h3>
            <p className="text-xs mt-2">NSM: {SCHOOL.nsm}</p>
            <p className="text-xs">NPSN: {SCHOOL.npsn}</p>
            <p className="text-xs">Alamat: {SCHOOL.address}</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-sm">
            <h3 className="font-semibold">Perizinan & Akreditasi</h3>
            <p className="text-sm mt-2">Akreditasi: {SCHOOL.accreditation}</p>
            <p className="text-sm">(Unggah dokumen resmi di versi server)</p>
          </div>
        </aside>
      </main>

      <footer className="bg-white border-t mt-6">
        <div className="container p-4 text-center text-xs text-gray-600">© {new Date().getFullYear()} {SCHOOL.name} — Semua hak dilindungi.</div>
      </footer>
    </div>
  )
}
