import logo from '@/assets/logo.png'

export default function OrganizationLogo() {
  return (
    <div className="flex justify-center">
      <div className="rounded-2xl bg-white p-3 shadow-xl shadow-slate-200/50">
        <img src={logo} alt="组织 LOGO" className="h-20 w-auto rounded-xl" />
      </div>
    </div>
  )
}
