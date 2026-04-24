import logo from '@/assets/logo.png'

export default function OrganizationLogo() {
  return (
    <div className="flex justify-center mb-10">
      <div className="p-2 bg-white rounded-2xl shadow-xl ring-4 ring-blue-50">
        <img src={logo} alt="组织 LOGO" className="w-44 h-auto rounded-xl" />
      </div>
    </div>
  )
}
